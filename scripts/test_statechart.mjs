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
