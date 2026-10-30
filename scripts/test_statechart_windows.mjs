import assert from "node:assert/strict";
import {test} from "node:test";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "skills/statechart/scripts/statechart.mjs");
const required = {skip: process.platform !== "win32" ? "Windows rename semantics" :
  !process.env.TLA2TOOLS && "TLA2TOOLS is not configured"};
const write = (dir, name, value) => {
  fs.mkdirSync(path.dirname(path.join(dir, name)), {recursive: true});
  fs.writeFileSync(path.join(dir, name), value);
};
const read = (dir, name) => fs.readFileSync(path.join(dir, name), "utf8");
const backups = dir => fs.readdirSync(dir).filter(n => n.startsWith(".Flow-statechart-") && n.endsWith("-old"));
const output = result => result.stdout + result.stderr;
function fixture(body, command = "from-spec") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sc-win-"));
  try {
    write(dir, "Flow.tla", "---- MODULE Flow ----\nVARIABLE x\nInit == x = 0\nNext == FALSE\nSpec == Init /\\ [][Next]_x\n====\n");
    write(dir, "Flow.cfg", "SPECIFICATION Spec\n");
    write(dir, "Flow.map.mjs", "export const state = () => 'Ready';\n");
    write(dir, "Flow.mmd", "stateDiagram-v2\n  [*] --> Idle\n  Idle --> Done: finish\n");
    const run = hook => {
      const hookPath = path.join(dir, "rename-hook.mjs");
      write(dir, "rename-hook.mjs", [
        "import fs from 'node:fs'; import path from 'node:path';",
        "const target = path.resolve('Flow-statechart'); const rename = fs.renameSync;",
        "const publication = (from,to) => path.resolve(to) === target && !String(from).endsWith('-old') && !fs.existsSync(to);",
        "const denial = (code,message) => Object.assign(new Error(message), {code});",
        hook,
      ].join("\n"));
      return spawnSync(process.execPath, [cli, command, command === "from-spec" ? "Flow.tla" : "Flow.mmd"], {
        cwd: dir, env: {...process.env, NODE_OPTIONS: "--import=" + pathToFileURL(hookPath).href},
        encoding: "utf8", timeout: 30000,
      });
    };
    body(dir, run);
  } finally { fs.rmSync(dir, {recursive: true, force: true, maxRetries: 10, retryDelay: 50}); }
}

test("Windows first publication survives transient permission and sharing denials", required, () => {
  fixture((dir, run) => {
    const result = run(`let attempts = 0;
      fs.renameSync = (from,to) => {
        if (publication(from,to) && attempts++ < 3)
          throw denial(['EPERM','EACCES','EBUSY'][attempts - 1], 'temporary Windows denial');
        return rename(from,to);
      };`);
    assert.equal(result.status, 0, output(result));
    assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 1);
    assert.deepEqual(backups(dir), []);
  });
});

test("Windows replacement retries moving the original and retains its files", required, () => {
  fixture((dir, run) => {
    write(dir, "Flow-statechart/stories.md", "ORIGINAL");
    write(dir, "Flow-statechart/tlc/manual.cfg", "USER SETTINGS");
    const result = run(`let attempts = 0;
      fs.renameSync = (from,to) => {
        if (path.resolve(from) === target && String(to).endsWith('-old') && attempts++ < 2)
          throw denial('EPERM', 'original temporarily locked');
        return rename(from,to);
      };`);
    assert.equal(result.status, 0, output(result));
    assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 1);
    const [old] = backups(dir);
    assert.ok(old, output(result));
    assert.ok(result.stdout.includes(old));
    assert.equal(read(dir, old + "/stories.md"), "ORIGINAL");
    assert.equal(read(dir, old + "/tlc/manual.cfg"), "USER SETTINGS");
  });
});

test("Windows rollback retries restoration after publication fails", required, () => {
  fixture((dir, run) => {
    write(dir, "Flow-statechart/stories.md", "ORIGINAL");
    const result = run(`let restoring = 0;
      fs.renameSync = (from,to) => {
        if (publication(from,to)) throw denial('EIO', 'publication failed');
        if (path.resolve(to) === target && String(from).endsWith('-old') && restoring++ < 2)
          throw denial('EPERM', 'restoration temporarily locked');
        return rename(from,to);
      };`);
    assert.equal(result.status, 2, output(result));
    assert.match(result.stderr, /publication failed/);
    assert.equal(read(dir, "Flow-statechart/stories.md"), "ORIGINAL");
    assert.deepEqual(backups(dir), []);
  });
});

test("Windows permanent denial is bounded, reports the first error and rolls back generated sources", required, () => {
  fixture((dir, run) => {
    write(dir, "Flow-statechart/stories.md", "ORIGINAL");
    const originalSpec = read(dir, "Flow.tla");
    const originalConfig = read(dir, "Flow.cfg");
    const originalMap = read(dir, "Flow.map.mjs");
    const result = run(`let attempts = 0;
      fs.renameSync = (from,to) => {
        if (publication(from,to)) {
          fs.appendFileSync('denials.txt', 'denied\\n');
          throw denial('EPERM', ++attempts === 1 ? 'FIRST publication denial' : 'later publication denial');
        }
        return rename(from,to);
      };`);
    assert.equal(result.status, 2, output(result));
    assert.match(result.stderr, /FIRST publication denial/);
    assert.doesNotMatch(result.stderr, /later publication denial/);
    const attempts = read(dir, "denials.txt").trim().split("\n").length;
    assert.ok(attempts > 1 && attempts <= 8, "retry must be bounded: " + attempts);
    assert.equal(read(dir, "Flow-statechart/stories.md"), "ORIGINAL");
    assert.equal(read(dir, "Flow.tla"), originalSpec);
    assert.equal(read(dir, "Flow.cfg"), originalConfig);
    assert.equal(read(dir, "Flow.map.mjs"), originalMap);
    assert.deepEqual(backups(dir), []);
  }, "from-chart");
});

test("Windows publication rechecks inputs after a transient denial", required, () => {
  fixture((dir, run) => {
    write(dir, "Flow-statechart/stories.md", "ORIGINAL");
    const result = run(`let once = true;
      fs.renameSync = (from,to) => {
        if (once && publication(from,to)) {
          once = false; fs.writeFileSync('Flow.map.mjs', "export const state = () => 'EDITED';\\n");
          throw denial('EPERM', 'temporary publication denial');
        }
        return rename(from,to);
      };`);
    assert.equal(result.status, 2, output(result));
    assert.match(result.stderr, /Flow\.map\.mjs changed while this run read it/);
    assert.equal(read(dir, "Flow-statechart/stories.md"), "ORIGINAL");
    assert.match(read(dir, "Flow.map.mjs"), /EDITED/);
    assert.deepEqual(backups(dir), []);
  });
});

for (const [name, foreign] of [["foreign files", true], ["a competing generated output", false]]) {
  test("Windows publication rechecks " + name + " arriving during retry", required, () => {
    fixture((dir, run) => {
      const file = foreign ? "notes.txt" : "stories.md";
      const result = run(`let once = true;
        fs.renameSync = (from,to) => {
          if (once && publication(from,to)) {
            once = false; fs.mkdirSync(target); fs.writeFileSync(path.join(target,${JSON.stringify(file)}), 'COMPETING');
            throw denial('EPERM', 'temporary publication denial');
          }
          return rename(from,to);
        };`);
      if (foreign) {
        assert.equal(result.status, 2, output(result));
        assert.match(result.stderr, /notes\.txt/);
        assert.equal(read(dir, "Flow-statechart/notes.txt"), "COMPETING");
        assert.equal(fs.existsSync(path.join(dir, "Flow-statechart/summary.json")), false);
        assert.deepEqual(backups(dir), []);
      } else {
        assert.equal(result.status, 0, output(result));
        assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 1);
        const [old] = backups(dir);
        assert.ok(old, output(result));
        assert.ok(result.stdout.includes(old));
        assert.equal(read(dir, old + "/stories.md"), "COMPETING");
      }
    });
  });
}

test("Windows permanent restoration denial preserves recovery and cleanup diagnostics", required, () => {
  fixture((dir, run) => {
    write(dir, "Flow-statechart/stories.md", "ORIGINAL");
    const result = run(`const remove = fs.rmSync;
      fs.renameSync = (from,to) => {
        if (publication(from,to)) throw denial('EIO', 'publication failed');
        if (path.resolve(to) === target && String(from).endsWith('-old')) {
          fs.appendFileSync('restoration-denials.txt', 'denied\\n');
          throw denial('EPERM', 'restoration permanently denied');
        }
        return rename(from,to);
      };
      fs.rmSync = (file,options) => {
        if (/^\\.Flow-statechart-[A-Za-z0-9]{6}$/.test(path.basename(String(file))))
          throw denial('EACCES', 'staging cleanup denied');
        return remove(file,options);
      };`);
    assert.equal(result.status, 2, output(result));
    assert.match(result.stderr, /publication failed/);
    assert.match(result.stderr, /staging cleanup denied/);
    assert.match(result.stderr, /could not put it back/);
    const [old] = backups(dir);
    assert.ok(old, output(result));
    assert.ok(result.stderr.includes(old));
    assert.equal(read(dir, old + "/stories.md"), "ORIGINAL");
    assert.equal(fs.existsSync(path.join(dir, "Flow-statechart")), false);
    const attempts = read(dir, "restoration-denials.txt").trim().split("\n").length;
    assert.ok(attempts > 1 && attempts <= 8, "restoration retry must be bounded: " + attempts);
    assert.doesNotMatch(result.stderr, /\n\s+at publish/);
  });
});

test("Windows publication recovers from a real child-file share-delete lock", required, () => {
  fixture((dir, run) => {
    write(dir, "hold-file.ps1", `param([string]$file, [string]$ready, [string]$release, [string]$released)
      $ErrorActionPreference = 'Stop'
      $handle = [System.IO.File]::Open($file, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
      try {
        [System.IO.File]::WriteAllText($ready, 'ready')
        $until = [DateTime]::UtcNow.AddSeconds(15)
        while (-not [System.IO.File]::Exists($release)) {
          if ([DateTime]::UtcNow -gt $until) { throw 'native lock release was not requested' }
          Start-Sleep -Milliseconds 5
        }
      } finally { $handle.Dispose(); [System.IO.File]::WriteAllText($released, 'released') }
    `);
    const result = run(`import {spawn} from 'node:child_process';
      let once = true;
      fs.renameSync = (from,to) => {
        if (once && publication(from,to)) {
          once = false;
          const child = spawn('powershell.exe', ['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.resolve('hold-file.ps1'),path.join(from,'stories.md'),path.resolve('lock-ready'),path.resolve('lock-release'),path.resolve('lock-released')], {cwd:path.dirname(process.cwd()), windowsHide:true, stdio:'ignore'});
          child.unref();
          const until = Date.now() + 10000;
          while (!fs.existsSync('lock-ready')) {
            if (Date.now() > until) throw new Error('native lock helper did not become ready');
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5);
          }
        }
        try { return rename(from,to); }
        catch (e) {
          fs.appendFileSync('native-denials.txt', e.code + '\\n');
          fs.writeFileSync('lock-release', 'release');
          const until = Date.now() + 10000;
          while (!fs.existsSync('lock-released')) {
            if (Date.now() > until) throw new Error('native lock helper did not release its handle');
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5);
          }
          throw e;
        }
      };`);
    assert.equal(result.status, 0, output(result));
    assert.match(read(dir, "native-denials.txt"), /EPERM/);
    assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 1);
    assert.deepEqual(backups(dir), []);
  });
});

for (const code of ["EXDEV", "ENOSYS", "EISDIR"]) {
  test("Windows " + code + " copy fallback retries an empty-folder claim without losing output", required, () => {
    fixture((dir, run) => {
      const result = run(`let attempts = 0;
        fs.renameSync = (from,to) => {
          if (publication(from,to)) {
            attempts++;
            if (attempts === 1) throw denial(${JSON.stringify(code)}, 'filesystem requires copy');
            if (attempts === 2) throw denial('EPERM', 'claim temporarily locked');
          }
          return rename(from,to);
        };`);
      assert.equal(result.status, 0, output(result));
      assert.equal(JSON.parse(read(dir, "Flow-statechart/summary.json")).modelStates, 1);
      assert.match(read(dir, "Flow-statechart/tlc/Flow.cfg"), /^SPECIFICATION Spec\s*$/);
      assert.deepEqual(backups(dir), []);
      assert.deepEqual(fs.readdirSync(dir).filter(n => n.startsWith(".Flow-statechart-")), []);
    });
  });
}

for (const replacement of ["file", "directory", "junction"]) {
  test("Windows retry preserves a " + replacement + " substituted for its staging folder", required, t => {
    if (replacement === "junction") {
      const probe = fs.mkdtempSync(path.join(os.tmpdir(), "sc-junction-probe-"));
      try {
        fs.mkdirSync(path.join(probe, "target"));
        try { fs.symlinkSync(path.join(probe, "target"), path.join(probe, "link"), "junction"); }
        catch (e) {
          if (!["EPERM", "EACCES", "ENOTSUP"].includes(e.code)) throw e;
          t.skip("junction creation unavailable: " + e.code);
          return;
        }
      } finally { fs.rmSync(probe, {recursive: true, force: true}); }
    }
    fixture((dir, run) => {
      write(dir, "Flow-statechart/stories.md", "ORIGINAL");
      const result = run(`let staging;
        fs.renameSync = (from,to) => {
          if (!staging && publication(from,to)) {
            staging = from; fs.writeFileSync('swap-target.txt', staging);
            rename(staging, path.resolve('displaced-stage'));
            const kind = ${JSON.stringify(replacement)};
            if (kind === 'file') fs.writeFileSync(staging, 'USER REPLACEMENT');
            else if (kind === 'directory') {
              fs.mkdirSync(staging); fs.writeFileSync(path.join(staging,'user.txt'), 'USER REPLACEMENT');
            } else fs.symlinkSync(path.resolve('displaced-stage'), staging, 'junction');
            throw denial('EPERM', 'temporary staging denial');
          }
          return rename(from,to);
        };`);
      assert.equal(result.status, 2, output(result));
      assert.match(result.stderr, /staging.*changed|changed.*staging/i);
      const staging = read(dir, "swap-target.txt");
      assert.ok(result.stderr.includes(path.basename(staging)), "retained staging path must be reported");
      assert.equal(read(dir, "Flow-statechart/stories.md"), "ORIGINAL");
      assert.ok(fs.existsSync(path.join(dir, "displaced-stage/summary.json")));
      const stat = fs.lstatSync(staging);
      if (replacement === "file") assert.equal(fs.readFileSync(staging, "utf8"), "USER REPLACEMENT");
      else if (replacement === "directory") assert.equal(fs.readFileSync(path.join(staging, "user.txt"), "utf8"), "USER REPLACEMENT");
      else assert.equal(stat.isSymbolicLink(), true);
    });
  });
}

test("Windows identity-handle cleanup cannot hide the publication error or restored output", required, () => {
  fixture((dir, run) => {
    write(dir, "Flow-statechart/stories.md", "ORIGINAL");
    const result = run(`let denials = 0, pinned, once = true; const open = fs.openSync, close = fs.closeSync;
      fs.openSync = (file,...args) => {
        const fd = open(file,...args);
        if (path.basename(String(file)) === "summary.json" && path.basename(path.dirname(String(file))).startsWith(".Flow-statechart-")) pinned = fd;
        return fd;
      };
      fs.renameSync = (from,to) => {
        if (publication(from,to)) { denials++; throw denial("EPERM", "primary publication denial"); }
        return rename(from,to);
      };
      fs.closeSync = fd => {
        if (fd === pinned && denials >= 6 && once) { once = false; throw new Error("identity handle cleanup denied"); }
        return close(fd);
      };`);
    assert.equal(result.status, 2, output(result));
    assert.match(result.stderr, /primary publication denial/);
    assert.match(result.stderr, /identity handle cleanup denied/);
    assert.equal(read(dir, "Flow-statechart/stories.md"), "ORIGINAL");
  });
});
