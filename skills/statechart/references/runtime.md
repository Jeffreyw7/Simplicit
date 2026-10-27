# Statechart runtimes

Use Node.js 22 or later. The bundled JavaScript is local and works independently of Codex-specific tools. Commands write beside their input; use a disposable, user-approved working directory and preserve source files.

## Model checking

Install or reuse Java 11+ and the official immutable [TLC 1.7.4 release](https://github.com/tlaplus/tlaplus/releases/tag/v1.7.4). The expected SHA-256 of `tla2tools.jar` is `936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88`. Verify the downloaded file before executing it. The helper never installs Java or TLC itself.

In PowerShell, set `$env:TLA2TOOLS` to the absolute JAR path. Optionally set `$env:JAVA` to the absolute Java executable. On POSIX shells, export the same environment variables. Without JAVA, Java is resolved from PATH. Missing dependencies are a blocked model-checking step, not a verification pass.

Run `node <skill-directory>/scripts/statechart.mjs --help` for commands. Quote paths containing spaces. Chart parsing and `chart-to-tla.mjs CHART.mmd --module NAME` need only Node; checking a model needs TLC.

## Optional PNG rendering

Mermaid source and model-checking results do not require a renderer. PNG needs pinned `pele@1.8.0` and `@resvg/resvg-js@2.6.2`. Only when installation is authorized, set `STATECHART_ALLOW_INSTALL=1` for the rendering command. The helper installs into `XDG_CACHE_HOME/statechart/`, or `~/.cache/statechart/` when unset. Choose a task-local XDG_CACHE_HOME to isolate installation, then unset the opt-in.

Rendering uses installed system fonts and optionally `fc-match`; lack of fc-match uses the renderer's system-font fallback. Inspect PNGs before claiming readability. If rendering cannot run, provide Mermaid and report PNG as not generated.

## Evidence

The exit code is 0 for the expected property outcomes, 1 for unexpected broken/holding properties or chart mismatch, and 2 for setup/input/execution failure. Read summary.json and stories.md; expected-broken goals must not be reported as verified invariants. A model result covers only its stated bounds and assumptions. Reproduce model findings against real code before calling them product bugs.
