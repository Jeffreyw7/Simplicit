import fs from "node:fs";
import process from "node:process";

// The parser is validated against the immutable TLC 1.7.4 release.
export const TLC_TOOL = "1.7.4";
export const JAVA_TOOL = "Java 11 or later";
const SET_TLC_VARS =
  "Set TLA2TOOLS to an existing tla2tools.jar (tested with 1.7.4), and optionally JAVA to a Java 11+ executable. Otherwise java is resolved from PATH. See references/runtime.md in the statechart skill.";

export function findTlc() {
  const {TLA2TOOLS, JAVA} = process.env;
  if (!TLA2TOOLS) {
    const error = new Error(`TLC is not configured. ${SET_TLC_VARS} No dependencies were installed.`);
    error.code = "ERR_TLC_NOT_CONFIGURED";
    throw error;
  }
  for (const [name, file] of Object.entries({JAVA, TLA2TOOLS})) {
    if (file && (!fs.existsSync(file) || !fs.statSync(file).isFile())) {
      throw new Error(`${name} is ${file}, which is not an existing file.`);
    }
  }
  return {jar: TLA2TOOLS, java: JAVA || "java"};
}

export function cannotRunTlc({java, jar}, result) {
  const said = `java exited ${result.status ?? result.signal}:\n${result.stderr ?? ""}${result.stdout ?? ""}`;
  return `cannot run TLC with ${java} -cp ${jar}: ${result.error?.message ?? said}\n${SET_TLC_VARS}`;
}
