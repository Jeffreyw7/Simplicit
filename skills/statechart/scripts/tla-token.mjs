// Non-string token boundaries used by the pinned TLC 1.7.4 lexer.
const operators = [
  ...String.raw`[]ASSUME []PROVE , : :: . _ == ( ) -|- [ ]_ ] {| |} { } << >>_ >> ! -> <- |-> ' ^+ ^* ^# -. ~ [] <> // /\ /= / \/ ~> => =< =| = ## # ^^ ^ -- -| -+-> - ** * ++ + <=> <: <= < >= > ... .. || | |- |= && & $$ $ ?? %% % @@ !! :> := ::= (+) (-) (.) (/) (\X)`.split(" "),
  ..."A E AA EE lnot neg approx asymp bigcirc bullet cap cdot circ cong cup div doteq equiv geq gg in intersect union land leq ll lor o odot ominus oplus oslash otimes prec preceq propto sim simeq sqcap sqcup sqsubset sqsupset sqsubseteq sqsupseteq star subset subseteq succ succeq supset supseteq uplus wr notin times X".split(" ").map((name) => `\\${name}`),
  "\\",
].sort((a, b) => b.length - a.length);

export function tlaToken(text, start = 0) {
  const rest = text.slice(start);
  const prefix = /^(?:WF_|SF_)/.exec(rest)?.[0];
  if (prefix) return prefix;
  const dynamic = /^(?:={4,}|-{4,}(?:[ \t]*MODULE)?|<(?:\d+|\*|\+)>[A-Za-z0-9_]*\.?|\\[bB][01]+|\\[oO][0-7]+|\\[hH][0-9A-Fa-f]+)/.exec(rest)?.[0];
  if (dynamic) return dynamic;
  const word = /^(?:[0-9_]*[A-Za-z][A-Za-z0-9_]*|[0-9]+)/.exec(rest)?.[0];
  const operator = operators.find((candidate) => rest.startsWith(candidate));
  return word && (!operator || word.length > operator.length) ? word : operator;
}
