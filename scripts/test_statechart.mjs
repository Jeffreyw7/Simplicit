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
