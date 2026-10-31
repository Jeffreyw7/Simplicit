import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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

test("from-chart refuses existing companions before creating a missing spec", async t => {
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
          assert.ok(result.stderr.includes(name), result.stderr);
        }
        assert.match(result.stderr, /already exists|already exist/);
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

        assert.equal(result.status, 2, result.stdout + result.stderr);
        assert.equal(fs.readFileSync(foreign, "utf8"), "user data");
        assert.match(result.stderr, /did not write/);
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

test("output containing model inputs is rejected without replacing them", () => {
  const dir = scratch();
  try {
    fs.writeFileSync(path.join(dir, "Flow.mmd"), chart);
    const compiled = node("chart-to-tla.mjs", ["Flow.mmd", "--module", "Flow", "--dir", "output/tlc"], dir);
    assert.equal(compiled.status, 0, compiled.stdout + compiled.stderr);
    const inputs = ["Flow.tla", "Flow.cfg", "Flow.map.mjs"]
      .map(name => [name, fs.readFileSync(path.join(dir, "output/tlc", name))]);

    const result = node("statechart.mjs", ["from-spec", "output/tlc/Flow.tla", "--out", "output"], dir);

    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stderr, /contains.*input/);
    for (const [name, contents] of inputs) {
      assert.deepEqual(fs.readFileSync(path.join(dir, "output/tlc", name)), contents);
    }
    assert.deepEqual(fs.readdirSync(path.join(dir, "output")), ["tlc"]);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("output containing model inputs reached through a directory alias is rejected", t => {
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
    assert.match(result.stderr, /contains.*input/);
    for (const [name, contents] of inputs) {
      assert.deepEqual(fs.readFileSync(path.join(dir, "output/tlc", name)), contents);
    }
  } finally {
    if (fs.existsSync(alias)) fs.unlinkSync(alias);
    fs.rmSync(dir, {recursive: true, force: true});
  }
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
    fs.mkdirSync(path.join(dir, "Flow"));
    fs.writeFileSync(path.join(dir, "Flow/keep.txt"), "user data");
    const result = node("statechart.mjs", ["from-chart", "Flow.mmd"], dir);
    assert.equal(result.status, 2);
    assert.equal(fs.readFileSync(path.join(dir, "Flow/keep.txt"), "utf8"), "user data");
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});
