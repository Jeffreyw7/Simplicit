import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import "./test_statechart_values.mjs";


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

test("postpublication cleanup failure keeps committed results and reports retained backup", tlcRequired, () => {
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
    assert.match(result.stderr, /injected cleanup failure/);
    assert.match(result.stderr, /previous output remains/);
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
