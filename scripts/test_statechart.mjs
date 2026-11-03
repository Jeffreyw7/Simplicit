import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseValue, tlaToken } from "../skills/statechart/scripts/lib.mjs";
import { readBroken } from "../skills/statechart/scripts/bug-states.mjs";
import "./test_statechart_values.mjs";
import "./test_statechart_recovery.mjs";
import "./test_statechart_config.mjs";
import "./test_statechart_symbols.mjs";
import "./test_statechart_windows.mjs";


const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scripts = path.join(root, "skills/statechart/scripts");
const scratch = () => fs.mkdtempSync(path.join(os.tmpdir(), "simplicit-statechart-"));
function node(script, args, cwd, env = {}) {
  return spawnSync(process.execPath, [path.join(scripts, script), ...args], {
    cwd, env: {...process.env, ...env}, encoding: "utf8", timeout: 120000
  });
}
const chart = 'stateDiagram-v2\n  [*] --> Idle\n  Idle --> Done: finish\n';
const hasTlc = Boolean(process.env.TLA2TOOLS);

test("the skill's documented help command resolves and runs without runtimes", () => {
  const dir = scratch();
  try {
    const skill = fs.readFileSync(path.join(root, "skills/statechart/SKILL.md"), "utf8");
    const command = skill.match(/`node "([^"]+)" --help`/);
    assert.ok(command, "the skill must provide a quoted executable help command");
    const script = command[1].replace("<skill dir>", path.join(root, "skills/statechart"));
    const result = spawnSync(process.execPath, [script, "--help"], {
      cwd: dir, encoding: "utf8", timeout: 30000,
      env: {...process.env, TLA2TOOLS: "", JAVA: "", PATH: ""},
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /from-chart/);
    assert.deepEqual(fs.readdirSync(dir), []);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

const tlcRequired = {skip: !hasTlc && "set TLA2TOOLS to run model checking"};
const read = (dir, name) => fs.readFileSync(path.join(dir, name), "utf8");
const write = (dir, name, text) => fs.writeFileSync(path.join(dir, name), text);
function oneState(dir, name, invariant = "") {
  write(dir, name + ".tla", "---- MODULE " + name + " ----\nVARIABLE x\nInit == x = 0\nNext == FALSE\nSpec == Init /\\ [][Next]_x\n" + invariant + "\n====\n");
  write(dir, name + ".cfg", "SPECIFICATION Spec\n");
  write(dir, name + ".map.mjs", "export const state = v => String(v.x);\n");
}

test("configuration literals survive extraction and agree with direct TLC", tlcRequired, () => {
  const dir = scratch();
  try {
    write(dir, "Space.tla", '---- MODULE Space ----\nCONSTANT C\nVARIABLE x\nInit == x = C\nNext == FALSE\nSpec == Init /\\ [][Next]_x\nSingleSpace == x = "two spaces"\n====\n');
    const cfg = 'SPECIFICATION Spec\nCONSTANT C = "two  spaces"\nINVARIANT SingleSpace\n';
    write(dir, "Space.cfg", cfg);
    write(dir, "Space.map.mjs", "export const state = v => v.x;\n");
    const direct = spawnSync(process.env.JAVA || "java", ["-cp", process.env.TLA2TOOLS, "tlc2.TLC", "-deadlock", "-config", "Space.cfg", "Space.tla"],
      {cwd: dir, encoding: "utf8", timeout: 120000});
    assert.equal(direct.status, 12, direct.stdout + direct.stderr);
    assert.match(direct.stdout, /Invariant SingleSpace is violated/);
    const result = node("statechart.mjs", ["from-spec", "Space.tla"], dir);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /SingleSpace is broken/);
    assert.match(read(dir, "Space-statechart/tlc/Space-SingleSpace.cfg"), /C = "two  spaces"/);
    assert.equal(read(dir, "Space.cfg"), cfg);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("config strings, comments and multiline rule lists retain their semantics", tlcRequired, () => {
  const dir = scratch();
  try {
    const literal = String.raw`"INVARIANT (* literal *) \\* text \"quoted\"  end"`;
    write(dir, "Lexical.tla", "---- MODULE Lexical ----\nCONSTANT C\nVARIABLE x\nInit == x = C\nNext == FALSE\nSpec == Init /\\ [][Next]_x\nExact == x = " + literal + "\nSafe == x = C\nAlways == [](x = C)\n====\n");
    const cfg = "(* outer (* nested *) comment *)\nSPECIFICATION Spec\nCONSTANT C = " + literal + "\nINVARIANTS\n  Exact (* between names *) Safe\nPROPERTIES\n  Always\n\\* trailing INVARIANT fake\n";
    write(dir, "Lexical.cfg", cfg);
    write(dir, "Lexical.map.mjs", "export const state = () => 'Ready';\n");
    const direct = spawnSync(process.env.JAVA || "java", ["-cp", process.env.TLA2TOOLS, "tlc2.TLC", "-deadlock", "-config", "Lexical.cfg", "Lexical.tla"],
      {cwd: dir, encoding: "utf8", timeout: 120000});
    // TLC config strings retain escapes differently from TLA expression strings.
    // The wrapper must preserve that distinction rather than normalize the constant.
    assert.equal(direct.status, 12, direct.stdout + direct.stderr);
    assert.match(direct.stdout, /Invariant Exact is violated/);
    const result = node("statechart.mjs", ["from-spec", "Lexical.tla"], dir);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /Exact is broken/);
    for (const rule of ["Safe", "Always"]) assert.match(result.stdout, new RegExp(rule + " holds"));
    const checked = read(dir, "Lexical-statechart/tlc/Lexical-Exact.cfg");
    assert.ok(checked.includes("CONSTANT C = " + literal));
    assert.ok(checked.includes("(* outer (* nested *) comment *)"));
    assert.equal(read(dir, "Lexical.cfg"), cfg);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("repeated generation publishes fresh results on the same output path", tlcRequired, () => {
  const dir = scratch();
  try {
    write(dir, "Flow.mmd", chart);
    for (let i = 0; i < 2; i++) {
      const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 2);
      if (i === 0) write(dir, "Flow-statechart/stories.md", "stale output sentinel");
    }
    assert.notEqual(read(dir, "Flow-statechart/stories.md"), "stale output sentinel");
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("mapping syntax and import failures return operational status and preserve output", tlcRequired, () => {
  for (const [mapping, reason] of [
    ["export const state = ;\n", /Unexpected token/],
    ["import './missing.mjs'; export const state = () => 'Ready';\n", /Cannot find/],
    ["throw null;\n", /null/],
    ["throw undefined;\n", /undefined/],
    ["throw 'mapping unavailable';\n", /mapping unavailable/],
  ]) {
    const dir = scratch();
    try {
      oneState(dir, "Bad");
      write(dir, "Bad.map.mjs", mapping);
      fs.mkdirSync(path.join(dir, "Bad-statechart"));
      write(dir, "Bad-statechart/stories.md", "previous result");
      const result = node("statechart.mjs", ["from-spec", "Bad.tla"], dir);
      assert.equal(result.status, 2, result.stdout + result.stderr);
      assert.match(result.stderr, /Bad\.map\.mjs/);
      assert.match(result.stderr, reason);
      assert.equal(read(dir, "Bad-statechart/stories.md"), "previous result");
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  }
});

test("blocked output is rejected before generating or overwriting sibling sources", () => {
  for (const filename of ["keep.txt", "tlc/keep.txt"]) {
    const dir = scratch();
    try {
      write(dir, "Flow.mmd", chart);
      write(dir, "Flow.cfg", "custom configuration");
      write(dir, "Flow.map.mjs", "custom mapping");
      const keep = path.join("Flow-statechart", filename);
      fs.mkdirSync(path.dirname(path.join(dir, keep)), {recursive: true});
      write(dir, keep, "user data");
      const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);
      assert.equal(result.status, 2, result.stdout + result.stderr);
      assert.equal(read(dir, "Flow.cfg"), "custom configuration");
      assert.equal(read(dir, "Flow.map.mjs"), "custom mapping");
      assert.equal(read(dir, keep), "user data");
      assert.equal(fs.existsSync(path.join(dir, "Flow.tla")), false);
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  }
});

test("failed generated-model validation restores all sibling sources", tlcRequired, () => {
  const dir = scratch();
  try {
    write(dir, "Flow.mmd", chart);
    write(dir, "Flow.cfg", "custom configuration");
    write(dir, "Flow.map.mjs", "custom mapping");
    const result = node("statechart.mjs", ["from-chart", "Flow.mmd", "--expect-broken", "MissingRule"], dir);
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.equal(read(dir, "Flow.cfg"), "custom configuration");
    assert.equal(read(dir, "Flow.map.mjs"), "custom mapping");
    assert.equal(fs.existsSync(path.join(dir, "Flow.tla")), false);
    assert.equal(fs.existsSync(path.join(dir, "Flow-statechart")), false);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("successful regeneration retains recoverable original configuration and mapping", tlcRequired, () => {
  const dir = scratch();
  try {
    write(dir, "Flow.mmd", chart);
    write(dir, "Flow.cfg", "custom configuration");
    write(dir, "Flow.map.mjs", "custom mapping");
    const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const backups = fs.readdirSync(dir).filter(n => n.startsWith(".Flow-statechart-backup-"));
    assert.equal(backups.length, 1, result.stdout + result.stderr);
    assert.equal(read(dir, path.join(backups[0], "Flow.cfg")), "custom configuration");
    assert.equal(read(dir, path.join(backups[0], "Flow.map.mjs")), "custom mapping");
    assert.match(read(dir, "Flow.cfg"), /INVARIANT TypeOK/);
    assert.match(result.stdout, /[Bb]ackup/);
    assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 2);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});


test("CR-only config comments preserve subsequent constants and invariants", tlcRequired, () => {
  const dir = scratch();
  try {
    write(dir, "Carriage.tla", '---- MODULE Carriage ----\nCONSTANT C\nVARIABLE x\nInit == x = C\nNext == FALSE\nSpec == Init /\\ [][Next]_x\nExact == x = "two spaces"\n====\n');
    write(dir, "Carriage.cfg", 'SPECIFICATION Spec\r\\* note\rCONSTANT C="two  spaces"\rINVARIANT Exact\r');
    write(dir, "Carriage.map.mjs", "export const state = v => v.x;\n");
    const direct = spawnSync(process.env.JAVA || "java", ["-cp", process.env.TLA2TOOLS, "tlc2.TLC", "-deadlock", "-config", "Carriage.cfg", "Carriage.tla"],
      {cwd: dir, encoding: "utf8", timeout: 120000});
    assert.equal(direct.status, 12, direct.stdout + direct.stderr);
    assert.match(direct.stdout, /Invariant Exact is violated/);
    const result = node("statechart.mjs", ["from-spec", "Carriage.tla"], dir);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /Exact is broken/);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("TLC TYPE sections after invariant lists retain direct-TLC behavior", tlcRequired, () => {
  for (const keyword of ["TYPE", "TYPE_CONSTRAINT"]) {
    const dir = scratch();
    try {
      oneState(dir, "Typed", "Safe == x = 0");
      write(dir, "Typed.cfg", "SPECIFICATION Spec\nINVARIANT Safe\n" + keyword + " Safe\n");
      const direct = spawnSync(process.env.JAVA || "java", ["-cp", process.env.TLA2TOOLS, "tlc2.TLC", "-deadlock", "-config", "Typed.cfg", "Typed.tla"],
        {cwd: dir, encoding: "utf8", timeout: 120000});
      assert.equal(direct.status, 0, direct.stdout + direct.stderr);
      const result = node("statechart.mjs", ["from-spec", "Typed.tla"], dir);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stdout, /Safe holds/);
      assert.ok(read(dir, "Typed-statechart/tlc/Typed-Safe.cfg").includes(keyword + " Safe"));
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  }
});

test("from-spec region proof artifacts permit regeneration", tlcRequired, () => {
  const dir = scratch();
  try {
    oneState(dir, "Region");
    write(dir, "Region.map.mjs", "export const state = () => 'Device: Idle';\n");
    for (let i = 0; i < 2; i++) {
      const result = node("statechart.mjs", ["from-spec", "Region.tla"], dir);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.ok(fs.existsSync(path.join(dir, "Region-statechart/tlc/regions-proof.mmd")));
    }
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("publication retains previous output without attempting to delete it", tlcRequired, () => {
  const dir = scratch();
  try {
    write(dir, "Flow.mmd", chart);
    write(dir, "Flow.cfg", "custom configuration");
    write(dir, "Flow.map.mjs", "custom mapping");
    fs.mkdirSync(path.join(dir, "Flow-statechart"));
    write(dir, "Flow-statechart/stories.md", "previous output");
    const hook = path.join(dir, "cleanup-failure.mjs");
    fs.writeFileSync(hook, [
      "import fs from 'node:fs';",
      "const remove = fs.rmSync;",
      "fs.rmSync = (target, options) => {",
      " if (String(target).endsWith('-old')) {",
      "  const e = new Error('injected cleanup failure'); e.code = 'EACCES'; throw e;",
      " } return remove(target, options);",
      "};",
    ].join("\n"));
    const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir,
      {NODE_OPTIONS: "--import=" + pathToFileURL(hook).href});
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.doesNotMatch(result.stderr, /injected cleanup failure/);
    assert.match(result.stdout, /Previous output preserved/);
    assert.ok(fs.existsSync(path.join(dir, "Flow.tla")));
    assert.match(read(dir, "Flow.cfg"), /INVARIANT TypeOK/);
    assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 2);
    const old = fs.readdirSync(dir).filter(n => n.startsWith(".Flow-statechart-") && n.endsWith("-old"));
    assert.equal(old.length, 1);
    assert.equal(read(dir, path.join(old[0], "stories.md")), "previous output");
    const sourceBackup = fs.readdirSync(dir).find(n => n.startsWith(".Flow-statechart-backup-"));
    assert.equal(read(dir, path.join(sourceBackup, "Flow.cfg")), "custom configuration");
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});



for (const phase of ["source stage", "work"]) {
  test(phase + " temporary cleanup cannot cancel successful publication", tlcRequired, () => {
    const dir = scratch();
    try {
      write(dir, "Flow.mmd", chart);
      write(dir, "Flow.cfg", "custom configuration");
      write(dir, "Flow.map.mjs", "custom mapping");
      const hook = path.join(dir, "temporary-cleanup-failure.mjs");
      const pattern = phase === "source stage" ? "^statechart-sources-" : "^statechart-[A-Za-z0-9]{6}$";
      fs.writeFileSync(hook, [
        "import fs from 'node:fs'; import path from 'node:path';",
        "const remove = fs.rmSync;",
        "const pattern = new RegExp(" + JSON.stringify(pattern) + ");",
        "fs.rmSync = (target, options) => {",
        " if (pattern.test(path.basename(String(target)))) {",
        "  const e = new Error('injected temporary cleanup failure'); e.code = 'EACCES'; throw e;",
        " } return remove(target, options);",
        "};",
      ].join("\n"));
      const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir,
        {NODE_OPTIONS: "--import=" + pathToFileURL(hook).href});
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stderr, /injected temporary cleanup failure/);
      assert.match(result.stderr, /temporary files remain/);
      assert.ok(fs.existsSync(path.join(dir, "Flow.tla")));
      assert.match(read(dir, "Flow.cfg"), /INVARIANT TypeOK/);
      assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 2);
      const sourceBackup = fs.readdirSync(dir).find(n => n.startsWith(".Flow-statechart-backup-"));
      assert.equal(read(dir, path.join(sourceBackup, "Flow.cfg")), "custom configuration");
      assert.match(result.stdout, /Backup of replaced sources/);
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  });
}


test("output rename failure restores previous output and generated sibling sources", tlcRequired, () => {
  const dir = scratch();
  try {
    write(dir, "Flow.mmd", chart);
    write(dir, "Flow.cfg", "custom configuration");
    write(dir, "Flow.map.mjs", "custom mapping");
    fs.mkdirSync(path.join(dir, "Flow-statechart"));
    write(dir, "Flow-statechart/stories.md", "previous output");
    const hook = path.join(dir, "rename-failure.mjs");
    fs.writeFileSync(hook, [
      "import fs from 'node:fs'; import path from 'node:path';",
      "const rename = fs.renameSync;",
      "fs.renameSync = (from, to) => {",
      " if (path.basename(String(to)) === 'Flow-statechart' && !String(from).endsWith('-old') && !fs.existsSync(to)) {",
      "  const e = new Error('injected publication failure'); e.code = 'EACCES'; throw e;",
      " } return rename(from, to);",
      "};",
    ].join("\n"));
    const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir,
      {NODE_OPTIONS: "--import=" + pathToFileURL(hook).href});
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stderr, /injected publication failure/);
    assert.equal(read(dir, "Flow-statechart/stories.md"), "previous output");
    assert.equal(read(dir, "Flow.cfg"), "custom configuration");
    assert.equal(read(dir, "Flow.map.mjs"), "custom mapping");
    assert.equal(fs.existsSync(path.join(dir, "Flow.tla")), false);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});




test("TLC checks the generated model and round-trips the chart", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, () => {
  const dir = scratch();
  try {
    fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
    const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const summary = JSON.parse(fs.readFileSync(path.join(dir, "Flow-statechart/summary.json"), "utf8"));
    assert.equal(summary.modelStates, 2);
    assert.equal(summary.chartStatus.wrong, 0);
    assert.match(result.stdout, /back unchanged/);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("a reachable forbidden state reports a failed invariant with a counterexample", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, () => {
  const dir = scratch();
  try {
    fs.writeFileSync(path.join(dir, "Flow.mmd"), chart + '  %% never NoDone: Done -- completion must be unreachable\n');
    const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    const summary = JSON.parse(fs.readFileSync(path.join(dir, "Flow-statechart/summary.json"), "utf8"));
    assert.ok(summary.chartStatus.wrong > 0);
    const stories = fs.readFileSync(path.join(dir, "Flow-statechart/stories.md"), "utf8");
    assert.match(stories, /Done|completion/);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("help works without external runtimes or writes", () => {
  const dir = scratch();
  try {
    const result = node("statechart.mjs", ["--help"], dir, {TLA2TOOLS: "", JAVA: "", PATH: ""});
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /from-chart/);
    assert.deepEqual(fs.readdirSync(dir), []);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("chart compilation produces a real TLA model without TLC", () => {
  const dir = scratch();
  try {
    fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
    const result = node("chart-to-tla.mjs", ["Flow.mmd", "--module", "Flow"], dir);
    assert.equal(result.status, 0, result.stderr);
    assert.match(fs.readFileSync(path.join(dir, "Flow.tla"), "utf8"), /Next/);
    assert.ok(fs.existsSync(path.join(dir, "Flow.cfg")));
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("missing TLC is actionable and never starts an automatic install", async () => {
  const old = {TLA2TOOLS: process.env.TLA2TOOLS, JAVA: process.env.JAVA};
  delete process.env.TLA2TOOLS; delete process.env.JAVA;
  try {
    const {findTlc} = await import(pathToFileURL(path.join(scripts, "tlc-tools.mjs")).href);
    assert.throws(() => findTlc(), {code: "ERR_TLC_NOT_CONFIGURED"});
  } finally {
    for (const [key, value] of Object.entries(old)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test("missing renderer does not install packages without opt-in", async () => {
  const dir = scratch();
  const old = {XDG_CACHE_HOME: process.env.XDG_CACHE_HOME, STATECHART_ALLOW_INSTALL: process.env.STATECHART_ALLOW_INSTALL};
  process.env.XDG_CACHE_HOME = dir; delete process.env.STATECHART_ALLOW_INSTALL;
  try {
    const {loadRenderer} = await import(pathToFileURL(path.join(scripts, "render.mjs")).href);
    await assert.rejects(loadRenderer(), {code: "ERR_RENDERER_NOT_INSTALLED"});
    assert.deepEqual(fs.readdirSync(dir), []);
  } finally {
    for (const [key, value] of Object.entries(old)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    fs.rmSync(dir, {recursive: true, force: true});
  }
});

test("invalid input fails without replacing unrelated output", () => {
  const dir = scratch();
  try {
    fs.writeFileSync(path.join(dir, "Flow.mmd"), "not a statechart");
    fs.mkdirSync(path.join(dir, "Flow-statechart"));
    fs.writeFileSync(path.join(dir, "Flow-statechart/keep.txt"), "user data");
    const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);
    assert.equal(result.status, 2);
    assert.equal(fs.readFileSync(path.join(dir, "Flow-statechart/keep.txt"), "utf8"), "user data");
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

function writeWordsModel(dir, {declarations = "CONSTANT Value", value = "Value", aliases = ""} = {}) {
  fs.writeFileSync(path.join(dir, "Words.tla"), `---- MODULE Words ----\n${declarations}\nVARIABLE x\nInit == x = ${value}\nNext == UNCHANGED x\nSpec == Init /\\ [][Next]_x\nExact == x = ${value}\nNoExactValue == ~Exact\n${aliases}\n====\n`);
  fs.writeFileSync(path.join(dir, "Words.map.mjs"), 'export const state = () => "Waiting";\nexport const step = action => action;\n');
}


test("TLC rule extraction keeps keyword tokens inside complete constant assignments", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, async t => {
  for (const fixture of [
    {name: "scalar", constants: "CONSTANT Value = INVARIANT"},
    {name: "compact scalar", constants: "CONSTANT Value=INVARIANT"},
    {name: "nested set", constants: "CONSTANT Value = { INVARIANT , { PROPERTY } }"},
    {name: "symbolic scalar brackets", constants: "CONSTANT Value = []"},
    {name: "symbolic scalar equals", constants: "CONSTANT Value = =="},
    {name: "dynamic equals token", value: "0", constants: "CONSTANT Value = ===="},
    {name: "long dynamic equals token", value: "0", constants: "CONSTANT Value = ====="},
    {name: "module header token", value: "0", constants: "CONSTANT Value = ---- MODULE"},
    {name: "adjacent assignments", declarations: "CONSTANT Value, Other", value: "0", constants: "CONSTANTS Value=+Other=plain"},
    {
      name: "function table",
      declarations: 'CONSTANT Key, Keys\nValue(a,b) == "original"',
      value: "Value(Key, Keys)",
      constants: "CONSTANTS Key = INVARIANT Keys = { PROPERTY } Value( INVARIANT, { PROPERTY } ) = { TYPE, { NEXT } }",
    },
    {name: "override", declarations: 'CONSTANT Value\nINVARIANT == "override"', constants: "CONSTANT Value <- INVARIANT"},
    {name: "module value", declarations: "INSTANCE TYPE", constants: "CONSTANT Value = [TYPE] INVARIANT"},
    {name: "module override", declarations: "INSTANCE TYPE", constants: "CONSTANT Value <- [TYPE] INVARIANT"},
    {name: "qualified name", declarations: "Instance == INSTANCE TYPE", value: "Instance!INVARIANT", constants: "CONSTANT Instance ! INVARIANT = PROPERTY"},
  ]) {
    await t.test(fixture.name, () => {
      const dir = scratch();
      try {
        writeWordsModel(dir, fixture);
        fs.writeFileSync(path.join(dir, "TYPE.tla"), '---- MODULE TYPE ----\nValue == "original"\nINVARIANT == "override"\n====\n');
        const kept = `SPECIFICATION Spec\r\n${fixture.constants}\r\n`;
        const config = `${kept}INVARIANT NoExactValue\r\n`;
        fs.writeFileSync(path.join(dir, "Words.cfg"), config);

        const result = node("statechart.mjs", ["from-spec", "Words.tla"], dir);

        assert.equal(result.status, 1, result.stdout + result.stderr);
        assert.match(result.stdout, /NoExactValue is broken/);
        for (const file of ["Words.cfg", "Words-NoExactValue.cfg"]) {
          assert.ok(fs.readFileSync(path.join(dir, "Words-statechart/tlc", file), "utf8").startsWith(kept), file);
        }
        assert.equal(fs.readFileSync(path.join(dir, "Words.cfg"), "utf8"), config);
        const summary = JSON.parse(fs.readFileSync(path.join(dir, "Words-statechart/summary.json"), "utf8"));
        assert.equal(summary.chartStatus.wrong, 1);
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    });
  }
});


test("symbolic model values retain broken-state metadata", () => {
  const dir = scratch();
  try {
    for (const symbol of ["==", "====", "+", "=>", "\\notin"]) {
      const text = `<<"statechart broken", [x |-> ${symbol}], {"NoExactValue"}>>`;
      assert.deepEqual(parseValue(text), ["statechart broken", {x: symbol}, ["NoExactValue"]]);
      const output = path.join(dir, "broken.out");
      fs.writeFileSync(output, text + "\n");
      assert.deepEqual(readBroken(output), [{key: JSON.stringify({x: symbol}), rules: ["NoExactValue"]}]);
    }
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});


test("TLC token boundaries preserve native operator and identifier separation", () => {
  for (const [text, expected] of [
    ["Value=+Other=plain", ["Value", "=", "+", "Other", "=", "plain"]],
    ["====", ["===="]],
    ["---- MODULE", ["---- MODULE"]],
    ["-----MODULE", ["-----MODULE"]],
    ["*)Other", ["*", ")", "Other"]],
    ["__", ["_", "_"]],
    ["1_2", ["1", "_", "2"]],
    ["_1", ["_", "1"]],
    ["123abc", ["123abc"]],
    ["__foo", ["__foo"]],
    ["<1>Foo.Bar", ["<1>Foo.", "Bar"]],
    ["\\notinOther", ["\\notin", "Other"]],
  ]) {
    const actual = [];
    for (let i = 0; i < text.length;) {
      const token = tlaToken(text, i);
      assert.ok(token, text.slice(i));
      actual.push(token);
      i += token.length;
    }
    assert.deepEqual(actual, expected, text);
  }
});


test("malformed broken-state metadata is rejected instead of becoming good states", () => {
  const dir = scratch();
  try {
    const output = path.join(dir, "broken.out");
    for (const text of [
      '<<"statechart broken", [x |-> 0], "wrong shape">>',
      '<<"statechart broken", [x |-> 0], {4}>>',
      '<<"statechart broken", 0, {"NoExactValue"}>>',
      '<<"statechart broken", [x |-> 0], {"NoExactValue"}',
    ]) {
      fs.writeFileSync(output, text + "\n");
      assert.throws(() => readBroken(output), /cannot read broken-state entry.*broken\.out/i);
    }
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});


test("TLC rule extraction consumes keyword-shaped directive arguments", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, async t => {
  for (const {directives, aliases} of [
    {directives: "INIT INVARIANT\r\nNEXT PROPERTY", aliases: "INVARIANT == Init\nPROPERTY == Next"},
    {directives: "SPECIFICATION INVARIANT", aliases: "INVARIANT == Spec"},
  ]) {
    await t.test(directives, () => {
      const dir = scratch();
      try {
        writeWordsModel(dir, {aliases});
        const kept = `${directives}\r\nCONSTANT Value = plain\r\n`;
        fs.writeFileSync(path.join(dir, "Words.cfg"), `${kept}INVARIANT NoExactValue\r\n`);

        const result = node("statechart.mjs", ["from-spec", "Words.tla"], dir);

        assert.equal(result.status, 1, result.stdout + result.stderr);
        assert.match(result.stdout, /NoExactValue is broken/);
        assert.ok(fs.readFileSync(path.join(dir, "Words-statechart/tlc/Words.cfg"), "utf8").startsWith(kept));
        const summary = JSON.parse(fs.readFileSync(path.join(dir, "Words-statechart/summary.json"), "utf8"));
        assert.equal(summary.chartStatus.wrong, 1);
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    });
  }
});


test("TLC TYPE directives delimit extracted rule lists", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, async t => {
  for (const directive of ["TYPE", "TYPE_CONSTRAINT"]) {
    await t.test(directive, () => {
      const dir = scratch();
      try {
        writeWordsModel(dir);
        const before = "SPECIFICATION Spec\r\nCONSTANT Value = plain\r\n";
        const after = `${directive} Exact\r\n`;
        fs.writeFileSync(path.join(dir, "Words.cfg"), `${before}INVARIANT NoExactValue\r\n${after}`);

        const result = node("statechart.mjs", ["from-spec", "Words.tla"], dir);

        assert.equal(result.status, 1, result.stdout + result.stderr);
        assert.match(result.stdout, /NoExactValue is broken/);
        for (const file of ["Words.cfg", "Words-NoExactValue.cfg"]) {
          assert.ok(fs.readFileSync(path.join(dir, "Words-statechart/tlc", file), "utf8").includes(before) && fs.readFileSync(path.join(dir, "Words-statechart/tlc", file), "utf8").includes(after), file);
        }
        const summary = JSON.parse(fs.readFileSync(path.join(dir, "Words-statechart/summary.json"), "utf8"));
        assert.equal(summary.chartStatus.wrong, 1);
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    });
  }
});


test("TLC rule extraction preserves config string values and ignores quoted or commented keywords", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, async t => {
  for (const {literal, expected} of [
    {literal: '"two  spaces"', expected: '"two  spaces"'},
    {literal: String.raw`"PROPERTY fake (* INVARIANT fake *) \\* comment \"quoted\" \\\\ tail"`, expected: "Value"},
  ]) {
    await t.test(literal, () => {
      const dir = scratch();
      try {
        fs.writeFileSync(path.join(dir, "Words.tla"), `---- MODULE Words ----\nCONSTANT Value\nVARIABLE x\nInit == x = Value\nNext == UNCHANGED x\nSpec == Init /\\ [][Next]_x\nExact == x = ${expected}\nNoExactValue == ~Exact\nAlwaysExact == []Exact\n====\n`);
        const constants = `CONSTANT Value = ${literal}\n`;
        const comment = literal === '"two  spaces"' ? "(* INVARIANT Missing *)" : "(* INVARIANT Missing (* PROPERTY AlsoMissing *) *)";
        fs.writeFileSync(path.join(dir, "Words.cfg"), `SPECIFICATION Spec\n${constants}${comment}\nINVARIANTS\n  NoExactValue \\* PROPERTY Missing\nPROPERTIES AlwaysExact\n`);
        fs.writeFileSync(path.join(dir, "Words.map.mjs"), 'export const state = () => "Waiting";\nexport const step = action => action;\n');

        const result = node("statechart.mjs", ["from-spec", "Words.tla"], dir);

        assert.equal(result.status, 1, result.stdout + result.stderr);
        assert.match(result.stdout, /NoExactValue is broken/);
        assert.match(result.stdout, /AlwaysExact holds/);
        for (const file of ["Words.cfg", "Words-NoExactValue.cfg", "Words-AlwaysExact.cfg"]) {
          assert.ok(fs.readFileSync(path.join(dir, "Words-statechart/tlc", file), "utf8").includes(constants), file);
        }
        const summary = JSON.parse(fs.readFileSync(path.join(dir, "Words-statechart/summary.json"), "utf8"));
        assert.equal(summary.chartStatus.wrong, 1);
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    });
  }
});


test("from-chart dependency preflight preserves existing companions before source generation", async t => {
  for (const companions of [["Flow.cfg"], ["Flow.map.mjs"], ["Flow.cfg", "Flow.map.mjs"]]) {
    await t.test(companions.join(" and "), () => {
      const dir = scratch();
      try {
        fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
        for (const name of companions) fs.writeFileSync(path.join(dir, name), `customized ${name}\n`);

        const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir, {TLA2TOOLS: ""});

        assert.equal(result.status, 2, result.stdout + result.stderr);
        assert.equal(fs.existsSync(path.join(dir, "Flow.tla")), false);
        for (const name of companions) {
          assert.equal(fs.readFileSync(path.join(dir, name), "utf8"), `customized ${name}\n`);
        }
        assert.match(result.stderr, /TLC|Java|TLA2TOOLS/);
        assert.deepEqual(fs.readdirSync(dir).sort(), ["Flow.mmd", ...companions].sort());
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    });
  }
});


test("CR-only config line comments do not hide later invariants", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, () => {
  const dir = scratch();
  try {
    fs.writeFileSync(path.join(dir, "Flow.tla"), '---- MODULE Flow ----\nVARIABLE x\nInit == x = 0\nNext == UNCHANGED x\nSpec == Init /\\ [][Next]_x\nNoIdle == x # 0\n====\n');
    fs.writeFileSync(path.join(dir, "Flow.cfg"), 'SPECIFICATION Spec\r\\* a line comment\rINVARIANT NoIdle\r');
    fs.writeFileSync(path.join(dir, "Flow.map.mjs"), 'export const state = () => "Idle";\nexport const step = action => action;\n');

    const result = node("statechart.mjs", ["from-spec", "Flow.tla"], dir);

    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /NoIdle is broken/);
    const summary = JSON.parse(fs.readFileSync(path.join(dir, "Flow-statechart/summary.json"), "utf8"));
    assert.equal(summary.chartStatus.wrong, 1);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});


test("output scans tolerate root publication races without skipping nested foreign data", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, async t => {
  for (const mode of ["disappear", "replace", "nested"]) {
    await t.test(mode, () => {
      const dir = scratch();
      try {
        fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
        const output = path.join(dir, "Flow-statechart");
        fs.mkdirSync(path.join(output, "tlc"), {recursive: true});
        fs.writeFileSync(path.join(output, "chart.mmd"), "previous chart");
        if (mode === "nested") {
          fs.writeFileSync(path.join(output, "tlc/notes.txt"), "user data");
          fs.writeFileSync(path.join(output, "tlc/disappeared.out"), "transient file");
        }
        const preload = path.join(dir, "concurrent-rename.mjs");
        fs.writeFileSync(preload, `import fs from "node:fs";\nimport path from "node:path";
const output = ${JSON.stringify(output)};
const mode = ${JSON.stringify(mode)};
const lstat = fs.lstatSync;
const readdir = fs.readdirSync;
let changed = false;
fs.lstatSync = function(file, ...args) {
  if (!changed && mode === "nested" && path.resolve(file) === path.join(output, "tlc/disappeared.out")) {
    changed = true;
    fs.unlinkSync(file);
  }
  const stat = lstat.call(fs, file, ...args);
  if (!changed && mode === "disappear" && path.resolve(file) === output && stat?.isDirectory()) {
    changed = true;
    fs.renameSync(output, output + "-held");
  }
  return stat;
};
fs.readdirSync = function(file, ...args) {
  const entries = readdir.call(fs, file, ...args);
  if (!changed && mode === "replace" && path.resolve(file) === output) {
    changed = true;
    fs.renameSync(output, output + "-held");
    fs.mkdirSync(path.join(output, "tlc"), {recursive: true});
    fs.writeFileSync(path.join(output, "tlc/notes.txt"), "user data");
  }
  return entries;
};\n`);

        const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir, {
          NODE_OPTIONS: `--import=${pathToFileURL(preload).href}`,
        });

        if (mode === "disappear") {
          assert.equal(result.status, 0, result.stdout + result.stderr);
          assert.equal(fs.readFileSync(path.join(`${output}-held`, "chart.mmd"), "utf8"), "previous chart");
          assert.ok(fs.existsSync(path.join(output, "summary.json")));
        } else {
          assert.equal(result.status, 2, result.stdout + result.stderr);
          assert.doesNotMatch(result.stdout, /TLC on/);
          assert.equal(fs.readFileSync(path.join(output, "tlc/notes.txt"), "utf8"), "user data");
          if (mode === "replace") assert.match(result.stderr, /did not write/);
        }
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    });
  }
});


test("nested foreign output files and wrong entry types are preserved", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, async t => {
  for (const name of ["tlc/notes.txt", "tlc/notes.cfg", "tlc/fixed/notes.txt", "tlc/against/notes.cfg", "chart.mmd/keep.txt", "tlc/Flow.dot/keep.txt", "tlc/.DS_Store/keep.txt"]) {
    await t.test(name, () => {
      const dir = scratch();
      try {
        fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
        const output = path.join(dir, "Flow-statechart");
        const foreign = path.join(output, name);
        fs.mkdirSync(path.dirname(foreign), {recursive: true});
        fs.writeFileSync(foreign, "user data");

        const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);

        if (name.endsWith(".cfg")) {
          assert.equal(result.status, 0, result.stdout + result.stderr);
          const backups = fs.readdirSync(dir).filter(n => n.endsWith("-old"));
          assert.equal(backups.length, 1);
          assert.equal(fs.readFileSync(path.join(dir, backups[0], name), "utf8"), "user data");
        } else {
          assert.equal(result.status, 2, result.stdout + result.stderr);
          assert.equal(fs.readFileSync(foreign, "utf8"), "user data");
          assert.match(result.stderr, /did not write/);
        }
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    });
  }
});


test("output directory aliases are refused without following them", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, async t => {
  for (const name of ["Flow-statechart", "Flow-statechart/tlc", "Flow-statechart/tlc/fixed", "Flow-statechart/tlc/.DS_Store"]) {
    await t.test(name, t => {
      const dir = scratch();
      const alias = path.join(dir, name);
      try {
        fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
        const target = path.join(dir, "user-data");
        fs.mkdirSync(target);
        fs.writeFileSync(path.join(target, "summary.json"), "user data");
        fs.mkdirSync(path.dirname(alias), {recursive: true});
        try {
          fs.symlinkSync(target, alias, process.platform === "win32" ? "junction" : "dir");
        } catch (error) {
          if (!["EPERM", "EACCES", "ENOTSUP"].includes(error.code)) throw error;
          t.skip("directory aliases are unavailable");
          return;
        }

        const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);

        assert.equal(result.status, 2, result.stdout + result.stderr);
        assert.equal(fs.lstatSync(alias).isSymbolicLink(), true);
        assert.equal(fs.readFileSync(path.join(target, "summary.json"), "utf8"), "user data");
      } finally {
        if (fs.lstatSync(alias, {throwIfNoEntry: false})?.isSymbolicLink()) fs.unlinkSync(alias);
        fs.rmSync(dir, {recursive: true, force: true});
      }
    });
  }
});


test("rerunning a chart replaces stale output and preserves model inputs", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, () => {
  const dir = scratch();
  try {
    fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
    const first = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);
    assert.equal(first.status, 0, first.stdout + first.stderr);
    const output = path.join(dir, "Flow-statechart");
    fs.writeFileSync(path.join(output, "bug-99.mmd"), "stale generated chart");
    for (const role of ["fixed", "against"]) {
      fs.mkdirSync(path.join(output, "tlc", role));
      for (const name of fs.readdirSync(path.join(output, "tlc"))) {
        const source = path.join(output, "tlc", name);
        if (fs.lstatSync(source).isFile()) fs.copyFileSync(source, path.join(output, "tlc", role, name));
      }
    }
    for (const name of ["Flow-RetiredRule.cfg", "Flow-RetiredRule.out", "regions-all.mmd", "regions-proof.mmd"]) {
      fs.writeFileSync(path.join(output, "tlc", name), "stale generated output");
    }
    for (const folder of ["", "tlc", "tlc/fixed", "tlc/against"]) {
      fs.writeFileSync(path.join(output, folder, ".DS_Store"), "Finder metadata");
    }
    fs.writeFileSync(path.join(dir, "Flow.mmd"), chart.replaceAll("Done", "Complete"));
    const spec = path.join(dir, "Flow.tla");
    fs.writeFileSync(spec, fs.readFileSync(spec, "utf8").replaceAll('"Done"', '"Complete"'));
    const inputs = ["Flow.mmd", "Flow.tla", "Flow.cfg", "Flow.map.mjs"]
      .map(name => [name, fs.readFileSync(path.join(dir, name))]);

    const second = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);

    assert.equal(second.status, 0, second.stdout + second.stderr);
    assert.match(second.stdout, /back unchanged/);
    const updated = fs.readFileSync(path.join(output, "chart.mmd"), "utf8");
    assert.match(updated, /Complete/);
    assert.doesNotMatch(updated, /Done/);
    assert.equal(fs.existsSync(path.join(output, "bug-99.mmd")), false);
    for (const name of ["fixed", "against", "Flow-RetiredRule.cfg", "regions-all.mmd"]) {
      assert.equal(fs.existsSync(path.join(output, "tlc", name)), false);
    }
    for (const [name, contents] of inputs) {
      assert.deepEqual(fs.readFileSync(path.join(dir, name)), contents);
    }
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});


test("unreserved model inputs in output are rejected without replacing them", () => {
  const dir = scratch();
  try {
    fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
    const compiled = node("chart-to-tla.mjs", ["Flow.mmd", "--module", "Flow", "--dir", "output/tlc"], dir);
    assert.equal(compiled.status, 0, compiled.stdout + compiled.stderr);
    const inputs = ["Flow.tla", "Flow.cfg", "Flow.map.mjs"]
      .map(name => [name, fs.readFileSync(path.join(dir, "output/tlc", name))]);

    const result = node("statechart.mjs", ["from-spec", "output/tlc/Flow.tla", "--out", "output"], dir);

    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stderr, /did not write/);
    for (const [name, contents] of inputs) {
      assert.deepEqual(fs.readFileSync(path.join(dir, "output/tlc", name)), contents);
    }
    assert.deepEqual(fs.readdirSync(path.join(dir, "output")), ["tlc"]);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});


test("unreserved model inputs reached through an alias are preserved", t => {
  const dir = scratch();
  const alias = path.join(dir, "model");
  try {
    fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
    const compiled = node("chart-to-tla.mjs", ["Flow.mmd", "--module", "Flow", "--dir", "output/tlc"], dir);
    assert.equal(compiled.status, 0, compiled.stdout + compiled.stderr);
    try {
      fs.symlinkSync(path.join(dir, "output/tlc"), alias, process.platform === "win32" ? "junction" : "dir");
    } catch (error) {
      if (!["EPERM", "EACCES", "ENOTSUP"].includes(error.code)) throw error;
      t.skip("directory aliases are unavailable");
      return;
    }
    const inputs = ["Flow.tla", "Flow.cfg", "Flow.map.mjs"]
      .map(name => [name, fs.readFileSync(path.join(dir, "output/tlc", name))]);

    const result = node("statechart.mjs", ["from-spec", "model/Flow.tla", "--out", "output"], dir);

    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stderr, /did not write/);
    for (const [name, contents] of inputs) {
      assert.deepEqual(fs.readFileSync(path.join(dir, "output/tlc", name)), contents);
    }
  } finally {
    if (fs.existsSync(alias)) fs.unlinkSync(alias);
    fs.rmSync(dir, {recursive: true, force: true});
  }
});


test("next-action diagnostics use parsed inline and indented config directives", {skip: !hasTlc && "set TLA2TOOLS to run model checking"}, async t => {
  for (const config of ["INIT Init NEXT Advance", "  INIT Init\n  NEXT Advance", "  SPECIFICATION Chosen", "(* prefix *) SPECIFICATION Chosen"]) {
    await t.test(config, () => {
      const dir = scratch();
      try {
        fs.writeFileSync(path.join(dir, "Actions.tla"), "---- MODULE Actions ----\nVARIABLE x\nInit == x = 0\nDecoy == UNCHANGED x\nFirst == Init /\\ [][Decoy]_x\nAdvance == x = 0 /\\ x' = 1\nChosen == Init /\\ [][Advance]_x\n====\n");
        fs.writeFileSync(path.join(dir, "Actions.cfg"), config + "\n");
        fs.writeFileSync(path.join(dir, "Actions.map.mjs"), "export const state = v => String(v.x);\nexport const step = a => a;\n");
        const result = node("statechart.mjs", ["from-spec", "Actions.tla"], dir);
        assert.equal(result.status, 0, result.stdout + result.stderr);
        assert.match(result.stderr, /step has the name Advance, the whole next-state action/);
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    });
  }
});
