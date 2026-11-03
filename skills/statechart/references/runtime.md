# Statechart runtimes

Use Node.js 22 or later. The bundled JavaScript is local and works independently of Codex-specific tools. Commands write beside their input; use a disposable, user-approved working directory and preserve source files.

## Model checking

Install or reuse Java 11+ and the official immutable [TLC 1.7.4 release](https://github.com/tlaplus/tlaplus/releases/tag/v1.7.4). The expected SHA-256 of `tla2tools.jar` is `936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88`. Verify the downloaded file before executing it. The helper never installs Java or TLC itself.

In PowerShell, set `$env:TLA2TOOLS` to the absolute JAR path. Optionally set `$env:JAVA` to the absolute Java executable. On POSIX shells, export the same environment variables. Without JAVA, Java is resolved from PATH. Missing dependencies are a blocked model-checking step, not a verification pass.

Run `node <skill-directory>/scripts/statechart.mjs --help` for commands. Quote paths containing spaces. Chart parsing and `chart-to-tla.mjs CHART.mmd --module NAME` need only Node; checking a model needs TLC.

`from-chart` keeps an existing `NAME.tla` and its companions. When that spec is missing, all three generated paths (`NAME.tla`, `NAME.cfg`, `NAME.map.mjs`) must be absent before automatic compilation starts. A collision leaves the companions unchanged and the spec missing; move the companions or choose another module name. Calling the standalone `chart-to-tla.mjs` compiler explicitly still replaces its three output files.

Per-rule TLC runs preserve the config text outside the extracted `INVARIANT` and `PROPERTY` sections, including string whitespace and escapes. Quoted text and comments do not introduce rule sections.

Output folders reserve `chart.mmd`/`.png`, `bug-N.mmd`/`.png` (including `-developer` and `-layered`), `stories.md`, `summary.json`, `.DS_Store`, and the `tlc` directory. In `tlc` and its optional `fixed` and `against` directories, a model's regular `.cfg`, `.out`, and `.dot` triplet reserves that model's files, its `MODEL-RULE.cfg`/`.out` files, and `MODEL_rules.tla`. Only the top `tlc` directory also reserves `regions-all.mmd` and `regions-proof.mmd`. Regular `.DS_Store` files are reserved in every recognized output directory. Other nested files, unexpected entry types, and symbolic links or directory aliases cause refusal before replacement. These names define replaceable output; they do not prove provenance, so keep user files outside that namespace.

When another run replaces the output folder during inspection, the command scans the replacement. If a nested entry disappears while the output folder itself remains the same, inspection stops and the command does not publish.

## Optional PNG rendering

Mermaid source and model-checking results do not require a renderer. PNG needs pinned `pele@1.8.0` and `@resvg/resvg-js@2.6.2`. Only when installation is authorized, set `STATECHART_ALLOW_INSTALL=1` for the rendering command. The helper installs into `XDG_CACHE_HOME/statechart/`, or `~/.cache/statechart/` when unset. Choose a task-local XDG_CACHE_HOME to isolate installation, then unset the opt-in.

Rendering uses installed system fonts and optionally `fc-match`; lack of fc-match uses the renderer's system-font fallback. Inspect PNGs before claiming readability. If rendering cannot run, provide Mermaid and report PNG as not generated.

## Evidence

The exit code is 0 for the expected property outcomes, 1 for unexpected broken/holding properties or chart mismatch, and 2 for setup/input/execution failure. Read summary.json and stories.md; expected-broken goals must not be reported as verified invariants. A model result covers only its stated bounds and assumptions. Reproduce model findings against real code before calling them product bugs.
