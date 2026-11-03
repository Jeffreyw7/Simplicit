import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "skills/statechart/scripts/statechart.mjs");
const requiresTlc = { skip: !process.env.TLA2TOOLS && "set TLA2TOOLS to run model checking" };
const artifacts = process.env.STATECHART_TEST_ARTIFACTS;
const read = (dir, file) => fs.readFileSync(path.join(dir, file), "utf8");
function run(command, args, cwd, name) {
  const result = spawnSync(command, args, { cwd, env: process.env, encoding: "utf8", timeout: 120000 });
  if (artifacts) fs.writeFileSync(path.join(cwd, `${name}.json`), JSON.stringify(result, null, 2));
  assert.ifError(result.error);
  assert.equal(result.signal, null, result.stdout + result.stderr);
  return result;
}
function fixture(name, cfg, expected, check, declarations = "C") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sc-cfg-"));
  try {
    fs.writeFileSync(path.join(dir, "Inner.tla"), "---- MODULE Inner ----\nOther == 1\nValue == Other\nINVARIANT == 0\n====\n");
    fs.writeFileSync(path.join(dir, "Case.tla"), `---- MODULE Case ----
CONSTANT ${declarations}
VARIABLE x
Part == INSTANCE Inner
INVARIANT == 0
PROPERTY == 1
Init == x = ${expected}
Next == x' = x /\\ FALSE
Spec == Init /\\ [][Next]_x
Bad == x # ${expected}
Safe == x = ${expected}
SafeAction == UNCHANGED x
Always == [](x = ${expected})
====
`);
    fs.writeFileSync(path.join(dir, "Case.cfg"), cfg);
    fs.writeFileSync(path.join(dir, "Case.map.mjs"), "export const state = () => 'Ready';\n");
    const direct = run(process.env.JAVA || "java", [
      "-XX:+UseParallelGC", "-cp", process.env.TLA2TOOLS, "tlc2.TLC", "-deadlock", "-config", "Case.cfg", "Case.tla",
    ], dir, "direct");
    const result = run(process.execPath, [cli, "from-spec", "Case.tla"], dir, "wrapper");
    check({ dir, direct, result });
    assert.equal(read(dir, "Case.cfg"), cfg, "the source configuration must not change");
  } finally {
    if (artifacts) {
      fs.mkdirSync(artifacts, { recursive: true });
      fs.cpSync(dir, path.join(artifacts, `${name}-${path.basename(dir)}`), { recursive: true });
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
function broken({ dir, direct, result }) {
  assert.equal(direct.status, 12, direct.stdout + direct.stderr);
  assert.match(direct.stdout, /Invariant Bad is violated by the initial state/);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Bad is broken/);
  assert.equal(result.stderr, "");
  const summary = JSON.parse(read(dir, "Case-statechart/summary.json"));
  assert.equal(summary.modelStates, 1);
  assert.equal(summary.classes.length, 1);
  assert.equal(summary.classes[0].invariant, "Bad");
  assert.equal(summary.classes[0].startsHere, true);
}

for (const [name, assignment, expected, state] of [
  ["keyword-scalar", "CONSTANT C = INVARIANT", "C", /x = INVARIANT/],
  ["keyword-set", "CONSTANT C = { INVARIANT , TYPE }", "C", /x = \{INVARIANT, TYPE\}/],
  ["nested-no-spaces", "CONSTANT C={{INVARIANT,PROPERTY},{TYPE},{}}", "C", /x = \{\{\}, \{TYPE\}, \{INVARIANT, PROPERTY\}\}/],
  ["keyword-replacement", "CONSTANT C <- INVARIANT", "C", /x = 0/],
  ["module-value", "CONSTANT C=0 Other=[Inner] INVARIANT", "Part!Value", /x = INVARIANT/],
  ["module-replacement", "CONSTANT C=0 Other<-[Inner] INVARIANT", "Part!Value", /x = 0/],
  ["qualified-replacement", "CONSTANT C=0 Part!Other <- INVARIANT", "Part!Other", /x = 0/],
]) {
  test(`config ${name} matches direct TLC without extracting its value as a rule`, requiresTlc, () => {
    // No whitespace is needed between the closing set delimiter and the next section.
    const cfg = `SPECIFICATION Spec\n${assignment}${name === "nested-no-spaces" ? "" : "\n"}INVARIANT Bad\n`;
    fixture(name, cfg, expected, (results) => {
      broken(results);
      assert.match(results.direct.stdout, state);
      assert.ok(read(results.dir, "Case-statechart/tlc/Case-Bad.cfg").includes(assignment));
    });
  });
}

// Keep C out of the state: these exercise config lexing, without depending on
// DOT rendering of punctuation-valued state variables.
for (const [index, scalar] of [
  "[]ASSUME", "[]PROVE", "==", "]_", "[]", "/=", "=>", "=<", "=|", "<=>",
  "<=", ">=", "|=", "!!", ":=", "::=", "(+)", "(-)", "(.)", "(/)", "(\\X)",
  "0INVARIANT", "_1INVARIANT", "T_value", "\\subseteq", "----", "====", "<1>step",
  "A./\\",
].entries()) {
  test(`config scalar ${scalar} keeps TLC's complete token`, requiresTlc, () => {
    const assignment = `CONSTANT C = ${scalar}`;
    const cfg = `SPECIFICATION Spec\n${assignment}\nINVARIANT Bad\n`;
    fixture(`scalar-${index}`, cfg, "0", (results) => {
      broken(results);
      assert.ok(read(results.dir, "Case-statechart/tlc/Case-Bad.cfg").includes(assignment));
    });
  });
}

test("config a symbolic value can immediately precede a rule section", requiresTlc, () => {
  fixture("symbol-adjacent", "SPECIFICATION Spec\nCONSTANT C = =>INVARIANT Bad\n", "0", broken);
});

for (const [name, assignment, declarations] of [
  ["operator-keyword", "C=INVARIANT F(INVARIANT)=TYPE", "C, F(_)"],
  ["operator-nested-set", "C={{INVARIANT},{TYPE}} F({{INVARIANT},{TYPE}})=PROPERTY", "C, F(_)"],
  ["operator-multiple", "C=INVARIANT F(INVARIANT,INVARIANT)=PROPERTY", "C, F(_,_)"],
]) {
  test(`config ${name} retains TLC's rejection after parsing constant-operator operands`, requiresTlc, () => {
    const cfg = `SPECIFICATION Spec\nCONSTANT ${assignment}\nINVARIANT Bad\n`;
    // Pinned TLC parses these operands, then rejects its configured operator
    // record during model initialization, even when F is unused by the model.
    fixture(name, cfg, "0", ({ dir, direct, result }) => {
      assert.equal(direct.status, 255, direct.stdout + direct.stderr);
      assert.match(direct.stdout, /java\.lang\.RuntimeException/);
      assert.equal(result.status, 2, result.stdout + result.stderr);
      assert.match(result.stderr, /TLC stopped on an error that is not a broken rule: TLC threw an unexpected exception/);
      assert.equal(fs.existsSync(path.join(dir, "Case-statechart")), false);
    }, declarations);
  });
}

test("config mixed sections retain comments, CR/LF, literal spacing, TYPE operands and deduplicated rules", requiresTlc, () => {
  const retained = 'INIT Init\r\nNEXT Next\rCONSTANT(* adjacent *)C={"INVARIANT  text","two  words"}\n';
  const tail = 'CONSTRAINTS Safe\r\nACTION_CONSTRAINT SafeAction\rTYPE INVARIANT\nTYPE_CONSTRAINT PROPERTY\r\nCHECK_DEADLOCK FALSE\n';
  const comment = "(* outer (* INVARIANT ignored *) comment *)";
  const cfg = retained + "INVARIANTS Safe " + comment + " Bad Safe\r" +
    "\\* PROPERTY ignored\rPROPERTIES Always Safe Always\n" + tail;
  fixture("mixed", cfg, "C", (results) => {
    broken(results);
    for (const rule of ["Safe", "Always"]) {
      assert.equal(results.result.stdout.split(`${rule} holds`).length - 1, 1, results.result.stdout);
    }
    const checked = read(results.dir, "Case-statechart/tlc/Case-Bad.cfg");
    assert.ok(checked.startsWith(retained));
    assert.ok(checked.includes(tail));
    assert.ok(checked.includes(comment));
    assert.ok(checked.includes("\\* PROPERTY ignored\r"));
    assert.deepEqual(checked.match(/\r\n|\r|\n/g).slice(0, cfg.match(/\r\n|\r|\n/g).length),
      cfg.match(/\r\n|\r|\n/g), "masking rule tokens preserves all original line endings");
  });
});

for (const [name, assignment] of [
  ["missing-set-comma", "CONSTANT C={INVARIANT TYPE}"],
  ["unclosed-set", "CONSTANT C={INVARIANT"],
  ["missing-module-bracket", "CONSTANT C=[Inner INVARIANT"],
  ["missing-replacement", "CONSTANT C<-"],
  ["empty-operator-arguments", "CONSTANT C()=INVARIANT"],
  ["numeric-adjacency-is-one-identifier", "CONSTANT C=0INVARIANT Bad"],
  ["qualified-rule-list", "CONSTANT C=0\nINVARIANT Part!INVARIANT"],
]) {
  test(`config ${name} remains an operational error`, requiresTlc, () => {
    const cfg = `SPECIFICATION Spec\n${assignment}\n`;
    fixture(name, cfg, "C", ({ dir, direct, result }) => {
      assert.notEqual(direct.status, 0, direct.stdout + direct.stderr);
      assert.match(direct.stdout, /Error:/);
      assert.equal(result.status, 2, result.stdout + result.stderr);
      assert.doesNotMatch(result.stdout, /Bad is broken|Wrote chart/);
      assert.equal(fs.existsSync(path.join(dir, "Case-statechart")), false);
    });
  });
}
