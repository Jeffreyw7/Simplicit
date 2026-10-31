import assert from "node:assert/strict";
import {test} from "node:test";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "skills/statechart/scripts/statechart.mjs");
const required = {skip: !process.env.TLA2TOOLS && "TLA2TOOLS is not configured"};
const chart = "stateDiagram-v2\n  [*] --> Idle\n  Idle --> Done: finish\n";
const write = (dir, name, value) => {
  const target = path.join(dir, name);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, value);
};
const read = (dir, name) => fs.readFileSync(path.join(dir, name), "utf8");
const fixture = () => fs.mkdtempSync(path.join(os.tmpdir(), "simplicit-recovery-"));
const run = (dir, command, env = {}, args = [command === "from-spec" ? "Flow.tla" : "Flow.mmd"]) => spawnSync(process.execPath, [cli, command, ...args],
  {cwd: dir, env: {...process.env, ...env}, encoding: "utf8", timeout: 120000});
function prepare(dir, command) {
  if (command === "from-chart") write(dir, "Flow.mmd", chart);
  else {
    write(dir, "Flow.tla", "---- MODULE Flow ----\nVARIABLE x\nInit == x = 0\nNext == FALSE\nSpec == Init /\\ [][Next]_x\n====\n");
    write(dir, "Flow.cfg", "SPECIFICATION Spec\n");
    write(dir, "Flow.map.mjs", "export const state = () => 'Ready';\n");
  }
}
const previousFolders = dir => fs.readdirSync(dir).filter(n => n.startsWith(".Flow-statechart-") && n.endsWith("-old"));

for (const command of ["from-chart", "from-spec"]) {
  test(command + " preserves unrelated TLC-format files in the reported previous output", required, () => {
    const dir = fixture();
    try {
      prepare(dir, command);
      const files = ["tlc/manual-acceptance.cfg", "tlc/notes.out", "tlc/fixed/manual.tla", "tlc/against/manual.dot"];
      for (const name of files) write(dir, "Flow-statechart/" + name, "MANUAL " + name + "\n");
      const result = run(dir, command);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const backups = previousFolders(dir);
      assert.equal(backups.length, 1, result.stdout + result.stderr);
      assert.ok((result.stdout + result.stderr).includes(backups[0]), "retained folder must be reported");
      for (const name of files) assert.equal(read(dir, backups[0] + "/" + name), "MANUAL " + name + "\n");
      assert.ok(fs.existsSync(path.join(dir, "Flow-statechart/summary.json")));
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  });

  test(command + " preserves recovery locations when publication restoration and cleanup fail", required, () => {
    const dir = fixture();
    try {
      prepare(dir, command);
      write(dir, "Flow-statechart/stories.md", "PREVIOUS OUTPUT\n");
      const hook = path.join(dir, "failures.mjs");
      fs.writeFileSync(hook, [
        "import fs from 'node:fs'; import path from 'node:path';",
        "const target = path.resolve('Flow-statechart');",
        "const rename = fs.renameSync, remove = fs.rmSync;",
        "const fail = message => Object.assign(new Error(message), {code:'EACCES'});",
        "fs.renameSync = (from,to) => {",
        " if (path.resolve(to) === target && !fs.existsSync(to)) throw fail('publication and restoration denied');",
        " return rename(from,to);",
        "};",
        "fs.rmSync = (file,options) => {",
        " if (/^\\.Flow-statechart-[A-Za-z0-9]{6}$/.test(path.basename(String(file)))) throw fail('staging cleanup denied');",
        " return remove(file,options);",
        "};",
      ].join("\n"));
      const result = run(dir, command, {NODE_OPTIONS: "--import=" + pathToFileURL(hook).href});
      assert.equal(result.status, 2, result.stdout + result.stderr);
      assert.match(result.stderr, /publication and restoration denied/);
      assert.match(result.stderr, /staging cleanup denied/);
      const [backup] = previousFolders(dir);
      assert.ok(backup, result.stdout + result.stderr);
      assert.ok(result.stderr.includes(backup), "diagnostic must identify displaced original");
      assert.equal(read(dir, backup + "/stories.md"), "PREVIOUS OUTPUT\n");
      assert.equal(fs.existsSync(path.join(dir, "Flow-statechart")), false);
      assert.doesNotMatch(result.stderr, /\n\s+at publish/);
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  });
}

test("successive publications retain distinct edited outputs", required, () => {
  const dir = fixture();
  try {
    prepare(dir, "from-chart");
    for (const marker of ["FIRST", "SECOND"]) {
      write(dir, "Flow-statechart/stories.md", marker);
      write(dir, "Flow-statechart/tlc/manual.cfg", marker);
      const result = run(dir, "from-chart");
      assert.equal(result.status, 0, result.stdout + result.stderr);
    }
    const backups = previousFolders(dir);
    assert.equal(backups.length, 2);
    assert.deepEqual(backups.map(n => read(dir, n + "/tlc/manual.cfg")).sort(), ["FIRST", "SECOND"]);
    assert.deepEqual(backups.map(n => read(dir, n + "/stories.md")).sort(), ["FIRST", "SECOND"]);
    assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 2);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("overlapping publications preserve each displaced output", required, () => {
  const dir = fixture();
  try {
    prepare(dir, "from-spec");
    write(dir, "Flow-statechart/stories.md", "ORIGINAL");
    const hook = path.join(dir, "overlap.mjs");
    fs.writeFileSync(hook, [
      "import fs from 'node:fs'; import path from 'node:path';",
      "const target = path.resolve('Flow-statechart'); const rename = fs.renameSync; let once = true;",
      "fs.renameSync = (from,to) => {",
      " const result = rename(from,to);",
      " if (once && path.resolve(from) === target && String(to).endsWith('-old')) {",
      "  once = false; fs.mkdirSync(target); fs.writeFileSync(path.join(target,'stories.md'), 'COMPETING');",
      " } return result;",
      "};",
    ].join("\n"));
    const result = run(dir, "from-spec", {NODE_OPTIONS: "--import=" + pathToFileURL(hook).href});
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const backups = previousFolders(dir);
    assert.equal(backups.length, 2);
    assert.deepEqual(backups.map(n => read(dir, n + "/stories.md")).sort(), ["COMPETING", "ORIGINAL"]);
    for (const folder of backups) assert.ok(result.stdout.includes(folder));
    assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 1);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

for (const [name, spec, cfg] of [
  ["nested config", "Flow.tla", "Flow-statechart/tlc/manual.cfg"],
  ["nested spec", "Flow-statechart/tlc/Flow.tla", "Flow-statechart/tlc/manual.cfg"],
  ["outside output", "Flow.tla", "Flow-statechart-other/manual.cfg"],
]) {
  test("publication inputs: " + name + " remain valid after output displacement", required, () => {
    const dir = fixture();
    try {
      prepare(dir, "from-spec");
      write(dir, spec, read(dir, "Flow.tla"));
      write(dir, cfg, "SPECIFICATION Spec\n");
      write(dir, "Flow-statechart/stories.md", "ORIGINAL");
      const result = run(dir, "from-spec", {}, [spec, "--config", cfg, "--map", "Flow.map.mjs", "--out", "Flow-statechart"]);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 1);
      assert.ok(fs.existsSync(path.join(dir, "Flow-statechart/chart.mmd")));
      assert.ok(fs.existsSync(path.join(dir, "Flow-statechart/stories.md")));
      const backups = previousFolders(dir);
      assert.equal(backups.length, 1, result.stdout + result.stderr);
      assert.ok(result.stdout.includes(backups[0]), "retained folder must be reported");
      assert.equal(read(dir, backups[0] + "/stories.md"), "ORIGINAL");
      assert.equal(read(dir, cfg.startsWith("Flow-statechart/") ? cfg.replace("Flow-statechart/", backups[0] + "/") : cfg), "SPECIFICATION Spec\n");
      if (spec.startsWith("Flow-statechart/"))
        assert.equal(read(dir, spec.replace("Flow-statechart/", backups[0] + "/")), read(dir, "Flow.tla"));
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  });
}

for (const [name, file] of [["config", "tlc/manual.cfg"], ["spec", "tlc/Flow.tla"]]) {
  test("publication inputs: changes to a relocated " + name + " still abort publication", required, () => {
    const dir = fixture();
    try {
      prepare(dir, "from-spec");
      write(dir, "Flow-statechart/tlc/Flow.tla", read(dir, "Flow.tla"));
      write(dir, "Flow-statechart/tlc/manual.cfg", "SPECIFICATION Spec\n");
      write(dir, "Flow-statechart/stories.md", "ORIGINAL");
      const hook = path.join(dir, "edit-relocated.mjs");
      fs.writeFileSync(hook, [
        "import fs from 'node:fs'; import path from 'node:path';",
        "const target = path.resolve('Flow-statechart'); const rename = fs.renameSync;",
        "fs.renameSync = (from,to) => {",
        " const result = rename(from,to);",
        " if (path.resolve(from) === target && String(to).endsWith('-old'))",
        "  fs.appendFileSync(path.join(to," + JSON.stringify(file) + "), '\\n\\\\* EDITED\\n');",
        " return result;",
        "};",
      ].join("\n"));
      const result = run(dir, "from-spec", {NODE_OPTIONS: "--import=" + pathToFileURL(hook).href},
        [name === "config" ? "Flow.tla" : "Flow-statechart/tlc/Flow.tla", "--config", "Flow-statechart/tlc/manual.cfg", "--map", "Flow.map.mjs", "--out", "Flow-statechart"]);
      assert.equal(result.status, 2, result.stdout + result.stderr);
      assert.ok(result.stderr.includes(path.normalize("Flow-statechart/" + file) + " changed while this run read it"), result.stderr);
      assert.match(read(dir, "Flow-statechart/" + file), /EDITED/);
      assert.equal(read(dir, "Flow-statechart/stories.md"), "ORIGINAL");
      assert.equal(fs.existsSync(path.join(dir, "Flow-statechart/summary.json")), false);
      assert.deepEqual(previousFolders(dir), []);
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  });
}

test("publication inputs: overlapping outputs keep validating the first displaced input", required, () => {
  const dir = fixture();
  try {
    prepare(dir, "from-spec");
    write(dir, "Flow-statechart/tlc/manual.cfg", "SPECIFICATION Spec\n");
    write(dir, "Flow-statechart/stories.md", "ORIGINAL");
    const hook = path.join(dir, "overlap-input.mjs");
    fs.writeFileSync(hook, [
      "import fs from 'node:fs'; import path from 'node:path';",
      "const target = path.resolve('Flow-statechart'); const rename = fs.renameSync; let once = true;",
      "fs.renameSync = (from,to) => {",
      " const result = rename(from,to);",
      " if (once && path.resolve(from) === target && String(to).endsWith('-old')) {",
      "  once = false; fs.mkdirSync(target); fs.writeFileSync(path.join(target,'stories.md'), 'COMPETING');",
      " } return result;",
      "};",
    ].join("\n"));
    const result = run(dir, "from-spec", {NODE_OPTIONS: "--import=" + pathToFileURL(hook).href},
      ["Flow.tla", "--config", "Flow-statechart/tlc/manual.cfg", "--map", "Flow.map.mjs", "--out", "Flow-statechart"]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const backups = previousFolders(dir);
    assert.equal(backups.length, 2, result.stdout + result.stderr);
    assert.deepEqual(backups.map(n => read(dir, n + "/stories.md")).sort(), ["COMPETING", "ORIGINAL"]);
    const original = backups.find(n => read(dir, n + "/stories.md") === "ORIGINAL");
    assert.equal(read(dir, original + "/tlc/manual.cfg"), "SPECIFICATION Spec\n");
    for (const folder of backups) assert.ok(result.stdout.includes(folder));
    assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 1);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test("mapping diagnostics safely describe arbitrary thrown values", required, () => {
  const maps = [
    "throw Object.create(null);",
    "throw {toString(){throw new Error('conversion failed')}};",
    "throw new Proxy({}, {getPrototypeOf(){throw new Error('prototype denied')}});",
    "const e = new Error(); Object.defineProperty(e, 'message', {get(){throw new Error('message denied')}}); throw e;",
    "const e = new Error(); e.message = Object.create(null); throw e;",
  ];
  for (const mapping of maps) {
    const dir = fixture();
    try {
      prepare(dir, "from-spec");
      write(dir, "Flow.map.mjs", mapping);
      write(dir, "Flow-statechart/stories.md", "PREVIOUS OUTPUT\n");
      const result = run(dir, "from-spec");
      assert.equal(result.status, 2, result.stdout + result.stderr);
      assert.match(result.stderr, /cannot load mapping Flow\.map\.mjs/);
      assert.match(result.stderr, /unprintable|unavailable|unknown|cannot describe/i);
      assert.doesNotMatch(result.stderr, /\n\s+at draw/);
      assert.equal(read(dir, "Flow-statechart/stories.md"), "PREVIOUS OUTPUT\n");
    } finally { fs.rmSync(dir, {recursive: true, force: true}); }
  }
});
