import assert from "node:assert/strict";
import {test} from "node:test";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {parseValue, parseState, stateKey, isTuple} from "../skills/statechart/scripts/lib.mjs";
import {readBroken, badStates} from "../skills/statechart/scripts/bug-states.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "skills/statechart/scripts/statechart.mjs");
const requiresTlc = {skip: !process.env.TLA2TOOLS && "set TLA2TOOLS to run model checking"};
const fixture = () => fs.mkdtempSync(path.join(os.tmpdir(), "sc-symbol-"));
const read = (dir, file) => fs.readFileSync(path.join(dir, file), "utf8");
function clean(dir) {
  if (process.env.STATECHART_TEST_ARTIFACTS) {
    fs.mkdirSync(process.env.STATECHART_TEST_ARTIFACTS, {recursive: true});
    fs.cpSync(dir, path.join(process.env.STATECHART_TEST_ARTIFACTS, path.basename(dir)), {recursive: true});
  }
  fs.rmSync(dir, {recursive: true, force: true});
}

test("symbolic model values stay structured inside TLC records, sets, tuples and functions", () => {
  const text = String.raw`[x |-> +, names |-> <<0INVARIANT, _1Name, 12Bad>>, values |-> {=>, <=>, (+), \\subseteq}, fn |-> (+ :> 0INVARIANT @@ 0INVARIANT :> =>)]`.replaceAll("\\\\subseteq", "\\subseteq");
  const got = parseValue(text);
  assert.deepEqual(got, {x: "+", names: ["0INVARIANT", "_1Name", "12Bad"], values: ["=>", "<=>", "(+)", "\\subseteq"], fn: {"+": "0INVARIANT", "0INVARIANT": "=>"}});
  assert.equal(isTuple(got.names), true);
  assert.equal(isTuple(got.values), false);
});

test("symbolic values preserve numeric and boolean kinds and distinct state keys", () => {
  assert.deepEqual(parseValue("<<0INVARIANT, 0, -7, TRUE, FALSE, +, =>>>"), ["0INVARIANT", 0, -7, true, false, "+", "=>"]);
  const names = ["+", "0INVARIANT", "0", "=>", "(+)"];
  const states = names.map(name => parseState("x = " + name));
  assert.deepEqual(states, [{x: "+"}, {x: "0INVARIANT"}, {x: 0}, {x: "=>"}, {x: "(+)"}]);
  assert.equal(new Set(states.map(stateKey)).size, names.length);
  for (const text of ['"unterminated', "[x |->", "<<1,", "(1 :> )"]) assert.equal(parseValue(text), text);
});

test("compound symbolic tokens retain TLC spelling inside structured values", () => {
  assert.deepEqual(parseValue(String.raw`<<{|, ]_, <1>step, A./\, []ASSUME, (\X)>>`), ["{|", "]_", "<1>step", "A./\\", "[]ASSUME", "(\\X)"]);
  assert.deepEqual(parseValue("<<[], {}, <<>>, [value |-> 1]>>"), [{}, [], [], {value: 1}]);
});

test("delimiter-shaped model values retain their enclosing collections", () => {
  const cases = [
    ["[x |-> (]", {x: "("}],
    ["[x |-> <<]", {x: "<<"}],
    ["[x |-> <<>>>>]", {x: [">>"]}],
    ["[x |-> <<>>_>>]", {x: [">>_"]}],
    ["[x |-> {}}]", {x: ["}"]}],
    ["[x |-> <<<<>>>>>>]", {x: [[">>"]]}],
  ];
  for (const [text, expected] of cases) assert.deepEqual(parseValue(text), expected, text);
});

test("ambiguous symbolic spellings are refused instead of changing collection boundaries", () => {
  const text = "[v |-> {<<>>, <<>>>>}]";
  assert.equal(parseValue(text), text);
});

test("malformed collections return promptly without exploring combinations of empty tuples", () => {
  const script = 'import {parseValue} from ' + JSON.stringify(new URL("../skills/statechart/scripts/lib.mjs", import.meta.url).href) + '; const text = "<<" + "<<>>, ".repeat(400) + "[broken]>>"; if (parseValue(text) !== text) process.exitCode = 1;';
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], {encoding: "utf8", timeout: 2000});
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("readBroken preserves multiline symbolic states and their actual violated rules", () => {
  const dir = fixture();
  try {
    const file = path.join(dir, "model.out");
    fs.writeFileSync(file, [
      "Computing initial states...",
      '<<"statechart broken", [x |-> +, names |-> <<0INVARIANT, =>>>], {"Safe"}>>',
      "Other TLC output",
      '<<"statechart broken",',
      ' [x |-> 0INVARIANT, names |-> <<+, =>>>],',
      ' {"Safe", "Other"}>>',
    ].join("\n"));
    const broken = readBroken(file);
    assert.deepEqual(broken, [
      {key: '{"names":["0INVARIANT","=>"],"x":"+"}', rules: ["Safe"]},
      {key: '{"names":["+","=>"],"x":"0INVARIANT"}', rules: ["Safe", "Other"]},
    ]);
    assert.deepEqual([...badStates([], broken, rule => rule === "Other")], ['{"names":["+","=>"],"x":"0INVARIANT"}']);
  } finally { clean(dir); }
});

test("malformed marked broken-state output fails clearly instead of inventing state data", () => {
  const dir = fixture();
  try {
    const file = path.join(dir, "bad.out");
    for (const entry of [
      '<<"statechart broken", [x |->',
      '<<"statechart broken", [x |-> 1], "Safe">>',
      '<<"statechart broken", [x |-> 1], {1}>>',
      '<<"statechart broken", 1, {"Safe"}>>',
    ]) {
      fs.writeFileSync(file, "TLC output\n" + entry + "\n");
      assert.throws(() => readBroken(file), error => {
        assert.match(error.message, /broken.state/i);
        assert.ok(error.message.includes(file));
        assert.match(error.message, /line 2|:2/);
        return true;
      });
    }
  } finally { clean(dir); }
});

function run(dir, args) {
  const result = spawnSync(process.execPath, [cli, "from-spec", "Symbols.tla", ...args], {cwd: dir, env: process.env, encoding: "utf8", timeout: 120000});
  assert.ifError(result.error);
  fs.writeFileSync(path.join(dir, "result-" + (args.length ? "expected" : "normal") + ".json"), JSON.stringify(result, null, 2));
  return result;
}

test("symbolic TLC states retain the complete counterexample and expected-broken exit behavior", requiresTlc, () => {
  const dir = fixture();
  try {
    fs.writeFileSync(path.join(dir, "Symbols.tla"), String.raw`---- MODULE Symbols ----
CONSTANT Start, End
VARIABLES x, payload
Init == x = Start /\ payload = [values |-> <<Start, {Start, End}>>]
Move == x = Start /\ x' = End /\ UNCHANGED payload
Next == Move
Spec == Init /\ [][Next]_<<x, payload>>
Safe == x # End
====
`);
    const cfg = "SPECIFICATION Spec\nCONSTANT Start = + End = 0INVARIANT\nINVARIANT Safe\n";
    fs.writeFileSync(path.join(dir, "Symbols.cfg"), cfg);
    fs.writeFileSync(path.join(dir, "Symbols.map.mjs"), "export function state(v) { if (typeof v.x !== 'string' || v.payload.values[1] !== '+' || !v.payload.values[2].includes('0INVARIANT')) throw new Error('mapping values changed'); return v.x === '+' ? 'Before' : 'After'; }\nexport const step = () => 'move';\n");
    for (const args of [[], ["--expect-broken", "Safe"]]) {
      const result = run(dir, args);
      assert.equal(result.status, args.length ? 0 : 1, result.stdout + result.stderr);
      assert.equal(result.stderr, "");
      const summary = JSON.parse(read(dir, "Symbols-statechart/summary.json"));
      assert.equal(summary.modelStates, 2);
      assert.equal(summary.modelTransitions, 1);
      assert.equal(summary.chartStates, 2);
      assert.equal(summary.chartTransitions, 1);
      assert.equal(summary.classes.length, 1);
      assert.equal(summary.classes[0].invariant, "Safe");
      assert.equal(summary.classes[0].end, "After");
      assert.equal(summary.classes[0].startsHere, false);
      assert.equal(summary.classes[0].readerSteps, 1);
      assert.equal(summary.classes[0].modelSteps, 2);
      assert.match(read(dir, "Symbols-statechart/stories.md"), /0\. Start: Before/);
      assert.match(read(dir, "Symbols-statechart/stories.md"), /1\..*move.*After/i);
      assert.equal(read(dir, "Symbols.cfg"), cfg);
    }
  } finally { clean(dir); }
});

test("operator model values render every initially broken state without merging labels", requiresTlc, () => {
  const dir = fixture();
  try {
    fs.writeFileSync(path.join(dir, "Symbols.tla"), "---- MODULE Symbols ----\nCONSTANT A, B, C, D\nVARIABLE x\nInit == x \\in {A, B, C, D}\nNext == FALSE\nSpec == Init /\\ [][Next]_x\nBad == x # x\n====\n");
    fs.writeFileSync(path.join(dir, "Symbols.cfg"), "SPECIFICATION Spec\nCONSTANT A = + B = 0INVARIANT C = => D = (+)\nINVARIANT Bad\n");
    fs.writeFileSync(path.join(dir, "Symbols.map.mjs"), "export const state = v => { if (typeof v.x !== 'string') throw new Error('model value lost'); return v.x; };\n");
    const result = run(dir, []);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    const summary = JSON.parse(read(dir, "Symbols-statechart/summary.json"));
    assert.equal(summary.modelStates, 4);
    assert.equal(summary.chartStates, 4);
    assert.equal(summary.classes.length, 4);
    assert.deepEqual(summary.classes.map(c => c.end).sort(), ["(+)", "+", "0INVARIANT", "=>"].sort());
    assert.ok(summary.classes.every(c => c.startsHere && c.invariant === "Bad"));
  } finally { clean(dir); }
});

test("delimiter-shaped TLC values preserve scalar, tuple, set and function mapping data", requiresTlc, () => {
  const dir = fixture();
  try {
    fs.writeFileSync(path.join(dir, "Symbols.tla"), String.raw`---- MODULE Symbols ----
EXTENDS TLC
CONSTANT C0, C1, C2, C3, C4, C5, C6, C7
VARIABLES x, tuple, set, fn
Init == /\ x \in {C0, C1, C2, C3, C4, C5, C6, C7}
        /\ tuple = <<x>> /\ set = {x} /\ fn = (x :> x)
Next == FALSE
Spec == Init /\ [][Next]_<<x, tuple, set, fn>>
Bad == x # x
====
`);
    fs.writeFileSync(path.join(dir, "Symbols.cfg"), "SPECIFICATION Spec\nCONSTANT C0 = ( C1 = << C2 = >> C3 = >>_ C4 = } C5 = ] C6 = ) C7 = ,\nINVARIANT Bad\n");
    fs.writeFileSync(path.join(dir, "Symbols.map.mjs"), "export function state(v) { if (typeof v.x !== 'string' || v.tuple[1] !== v.x || v.set.length !== 1 || v.set[0] !== v.x || v.fn[v.x] !== v.x) throw new Error('symbolic mapping data changed'); return 'value ' + v.x; }\n");
    const direct = spawnSync(process.env.JAVA || "java", ["-cp", process.env.TLA2TOOLS, "tlc2.TLC", "-deadlock", "-config", "Symbols.cfg", "Symbols.tla"], {cwd: dir, env: process.env, encoding: "utf8", timeout: 120000});
    fs.writeFileSync(path.join(dir, "direct.json"), JSON.stringify(direct, null, 2));
    assert.equal(direct.status, 12, direct.stdout + direct.stderr);
    const result = run(dir, []);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.equal(result.stderr, "");
    const summary = JSON.parse(read(dir, "Symbols-statechart/summary.json"));
    assert.equal(summary.modelStates, 8);
    assert.equal(summary.chartStates, 8);
    assert.equal(summary.classes.length, 8);
    assert.deepEqual(summary.classes.map(c => c.end).sort(), ["(", "<<", ">>", ">>_", "}", "]", ")", ","].map(v => "value " + v).sort());
    assert.ok(summary.classes.every(c => c.startsHere && c.invariant === "Bad"));
  } finally { clean(dir); }
});
