import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMermaid, parseValue, parseState, stateKey, productOf } from "../skills/statechart/scripts/lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scripts = path.join(root, "skills/statechart/scripts");
const hasTlc = Boolean(process.env.TLA2TOOLS);
const requiresTlc = { skip: !hasTlc && "set TLA2TOOLS to run model checking" };
const artifacts = process.env.STATECHART_TEST_ARTIFACTS;
function scratch(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `statechart-values-${name}-`));
}
function clean(dir) {
  if (artifacts) {
    fs.mkdirSync(artifacts, { recursive: true });
    fs.cpSync(dir, path.join(artifacts, path.basename(dir)), { recursive: true });
  }
  fs.rmSync(dir, { recursive: true, force: true });
}
function run(args, cwd) {
  const result = spawnSync(process.execPath, [path.join(scripts, "statechart.mjs"), ...args], {
    cwd, env: process.env, encoding: "utf8", timeout: 120000,
  });
  if (artifacts) fs.writeFileSync(path.join(cwd, "command-result.json"), JSON.stringify(result, null, 2));
  assert.ifError(result.error);
  return result;
}
const parallelChart = (secondCaption) => `stateDiagram-v2
state Both {
  state "Device" as first {
    [*] --> A
    A --> B: first step
  }
  --
  state "${secondCaption}" as second {
    [*] --> C
    C --> D: second step
  }
}
`;

test("TLA string escapes preserve control characters and literal backslashes", () => {
  // TLA+ defines these six escapes; JSON's extra escapes are not part of this syntax.
  const cases = [
    [String.raw`"a\nb"`, "a\nb"],
    [String.raw`"a\tb"`, "a\tb"],
    [String.raw`"a\fb"`, "a\fb"],
    [String.raw`"a\rb"`, "a\rb"],
    [String.raw`"a\"b"`, 'a"b'],
    [String.raw`"a\\b"`, "a\\b"],
    [String.raw`"a\\nb"`, "a\\nb"],
    [String.raw`"anb"`, "anb"],
    ['""', ""],
    ['"two  spaces"', "two  spaces"],
  ];
  for (const [source, expected] of cases) assert.equal(parseValue(source), expected, source);
  assert.deepEqual(parseValue(String.raw`[text |-> "a\nb", values |-> <<"a\tb", "atb">>]`), {
    text: "a\nb", values: ["a\tb", "atb"],
  });
  assert.deepEqual(parseValue(String.raw`("a\nb" :> 1 @@ "anb" :> 2)`), { "a\nb": 1, anb: 2 });
});

test("malformed TLA string escapes preserve the raw value instead of losing characters", () => {
  for (const source of [
    String.raw`"a\qb"`, String.raw`"a\bb"`, String.raw`"\u0041"`, String.raw`"\x41"`,
    '"unterminated', '"dangling\\', String.raw`"escaped closing quote\"`,
    String.raw`<<"a\qb", 1>>`,
  ]) assert.equal(parseValue(source), source, source);
});

test("state keys distinguish escaped newlines from literal letters", () => {
  const before = parseState(String.raw`x = "a\nb"`);
  const after = parseState(String.raw`x = "anb"`);
  assert.deepEqual(before, { x: "a\nb" });
  assert.deepEqual(after, { x: "anb" });
  assert.notEqual(stateKey(before), stateKey(after));
});

test("duplicate parallel-region captions are rejected before a region can be discarded", () => {
  assert.throws(() => parseMermaid(parallelChart("Device")), /regions.*caption.*Device/i);
  assert.throws(() => parseMermaid(parallelChart("De<br/>vice").replace('"Device"', '"De vice"')),
    /regions.*caption.*De vice/i);
});

test("region captions remain data when they match JavaScript object properties", () => {
  assert.deepEqual(Object.keys(parseMermaid(parallelChart("__proto__")).regions), ["Device", "__proto__"]);
  const chart = parallelChart("__proto__").replace("A --> B: first step", "A --> B: first step [C]\n    %% when C");
  const { regions } = parseMermaid(chart);
  assert.deepEqual(Object.keys(regions), ["Device", "__proto__"]);
  assert.deepEqual([...regions.__proto__.states], ["C", "D"]);
  const graph = productOf(regions);
  assert.deepEqual([...graph.states].sort(), ["A | C", "A | D", "B | C", "B | D"]);
  assert.equal(graph.transitions.length, 3);
  assert.equal(graph.transitions.some((t) => t.from === "A | D" && t.to === "B | D"), false);
  assert.throws(() => parseMermaid(parallelChart("__proto__").replace('"Device"', '"__proto__"')),
    /regions.*caption.*__proto__/i);
  assert.deepEqual(Object.keys(parseMermaid(parallelChart("constructor")).regions), ["Device", "constructor"]);
});

test("from-chart rejects duplicate captions without publishing an incomplete model", requiresTlc, () => {
  const dir = scratch("duplicates");
  try {
    fs.writeFileSync(path.join(dir, "Dup.mmd"), parallelChart("Device"));
    const result = run(["from-chart", "Dup.mmd"], dir);
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stderr, /regions.*caption.*Device/i);
    assert.doesNotMatch(result.stdout, /back unchanged/);
    for (const name of ["Dup.tla", "Dup.cfg", "Dup.map.mjs", "Dup-statechart"])
      assert.equal(fs.existsSync(path.join(dir, name)), false, `${name} must not be generated`);
  } finally { clean(dir); }
});

test("TLC retains both distinct-caption regions and all four reachable combinations", requiresTlc, () => {
  const dir = scratch("parallel");
  try {
    fs.writeFileSync(path.join(dir, "Both.mmd"), parallelChart("Other device"));
    const result = run(["from-chart", "Both.mmd"], dir);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const tla = fs.readFileSync(path.join(dir, "Both.tla"), "utf8");
    assert.match(tla, /VARIABLES device, otherDevice/);
    assert.match(tla, /deviceStates == \{"A", "B"\}/);
    assert.match(tla, /otherDeviceStates == \{"C", "D"\}/);
    const summary = JSON.parse(fs.readFileSync(path.join(dir, "Both-statechart/summary.json"), "utf8"));
    assert.equal(summary.modelStates, 4);
    assert.equal(summary.modelTransitions, 4);
    assert.equal(summary.chartStates, 4);
    assert.equal(summary.chartTransitions, 4);
    assert.match(result.stdout, /back unchanged/);
  } finally { clean(dir); }
});

test("TLC escaped strings stay distinct in the chart and one-step counterexample", requiresTlc, () => {
  const dir = scratch("escapes");
  try {
    fs.writeFileSync(path.join(dir, "Escape.tla"), String.raw`---- MODULE Escape ----
VARIABLE x
Init == x = "a\nb"
Move == x = "a\nb" /\ x' = "anb"
Next == Move
Spec == Init /\ [][Next]_x
NoEnd == x # "anb"
====
`);
    fs.writeFileSync(path.join(dir, "Escape.cfg"), "SPECIFICATION Spec\nINVARIANT NoEnd\n");
    fs.writeFileSync(path.join(dir, "Escape.map.mjs"), String.raw`export const state = v => v.x === "a\nb" ? "Before" : "After";
export const step = () => "move";
`);
    const result = run(["from-spec", "Escape.tla"], dir);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    const out = path.join(dir, "Escape-statechart");
    const summary = JSON.parse(fs.readFileSync(path.join(out, "summary.json"), "utf8"));
    assert.equal(summary.modelStates, 2);
    assert.equal(summary.modelTransitions, 1);
    assert.equal(summary.chartStates, 2);
    assert.equal(summary.chartTransitions, 1);
    assert.equal(summary.classes.length, 1);
    const bug = summary.classes[0];
    assert.equal(bug.invariant, "NoEnd");
    assert.equal(bug.end, "After");
    assert.equal(bug.startsHere, false);
    assert.equal(bug.readerSteps, 1);
    // The existing summary field counts trace states, including the initial state.
    assert.equal(bug.modelSteps, 2);
    const chart = fs.readFileSync(path.join(out, "chart.mmd"), "utf8");
    assert.match(chart, /state "Before"/);
    assert.match(chart, /state "After"/);
    assert.match(chart, /-->.*: move/);
    const story = fs.readFileSync(path.join(out, "stories.md"), "utf8");
    assert.match(story, /0\. Start: Before/);
    assert.match(story, /1\..*move.*After/i);
    assert.doesNotMatch(story, /starts in this bug/);
  } finally { clean(dir); }
});
