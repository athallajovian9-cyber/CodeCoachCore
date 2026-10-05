// =============================================================================
// CodeCoach Core Automated Test Suite (Node.js native test runner)
// =============================================================================

import test from "node:test";
import assert from "node:assert/strict";
import { analyzeCode } from "./engine.js";

test("Python Engine detects single '=' in if statement", () => {
  const code = "if score = 10:\n    pass";
  const issues = analyzeCode("python", code);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].kind, "QUIET BUG");
});

test("JavaScript Engine detects while(true) infinite loop", () => {
  const code = "while (true) {\n  console.log('hi');\n}";
  const issues = analyzeCode("javascript", code);
  assert.ok(issues.some(i => i.kind === "LOOP NEVER STOPS!"));
});

test("TypeScript Engine flags ': any' escape hatch", () => {
  const code = "const data: any = 123;";
  const issues = analyzeCode("typescript", code);
  assert.ok(issues.some(i => i.kind === "TRICKY PITFALL"));
});

test("Luau Engine flags while loop missing wait", () => {
  const code = "while true do\n    print('freeze')\nend";
  const issues = analyzeCode("luau", code);
  assert.ok(issues.some(i => i.kind === "LOOP NEVER STOPS!"));
});

test("HTML Engine flags deprecated <center> tag", () => {
  const code = "<center>Title</center>";
  const issues = analyzeCode("html", code);
  assert.ok(issues.some(i => i.kind === "OUTDATED HABIT"));
});
