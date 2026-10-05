// =============================================================================
// CodeCoach Multi-Language Static Analysis & AST Linter Engine
// Compiled JavaScript (ES Module) for Node.js backend
// =============================================================================

export function analyzeCode(lang, code) {
  const issues = [];
  const lines = code.split("\n");

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    const line = rawLine.trim();
    if (!line) return;

    // --- PYTHON ENGINE ---
    if (lang === "python") {
      if (line.startsWith("#")) return;
      if (/\bif\s+[^=!<>\n]*=[^=!<>\n]*:/.test(line)) {
        issues.push({
          kind: "QUIET BUG",
          line: lineNum,
          title: "SINGLE EQUALS '=' IN IF CHECK!",
          message: "Single '=' sets a value. Use '==' to test if two things are equal!",
          fixHint: "Replace '=' with '==' e.g. if score == 10:"
        });
      }
      if (/^while\s+True\s*:/.test(line)) {
        issues.push({
          kind: "LOOP NEVER STOPS!",
          line: lineNum,
          title: "RUNAWAY WHILE LOOP!",
          message: "This loop condition never becomes false and might freeze your PC!",
          fixHint: "Add an exit condition or a 'break' statement inside the loop."
        });
      }
      if (/^print\s+["']/.test(line)) {
        issues.push({
          kind: "SYNTAX WARNING",
          line: lineNum,
          title: "MISSING BRACKETS ON PRINT!",
          message: "In Python 3, print is a function that needs parentheses ().",
          fixHint: "Wrap your message like print(\"Hello world!\")"
        });
      }
    }

    // --- JAVASCRIPT & TYPESCRIPT ENGINE ---
    if (lang === "javascript" || lang === "typescript") {
      if (line.startsWith("//") || line.startsWith("/*")) return;
      if (/\bif\s*\([^=!<>\n]*=[^=!<>\n]*\)/.test(line) && !/===|==|<=|>=|!=/.test(line)) {
        issues.push({
          kind: "QUIET BUG",
          line: lineNum,
          title: "ACCIDENTAL ASSIGNMENT IN IF CHECK!",
          message: "Single '=' assigns a value instead of comparing it.",
          fixHint: "Use '===' to test strict equality, e.g. if (score === 10)"
        });
      }
      if (/[^=!<>]={2}[^=]/.test(line) && !line.includes("===")) {
        issues.push({
          kind: "TRICKY PITFALL",
          line: lineNum,
          title: "LOOSE EQUALITY '==' CAN TRICK YOU!",
          message: "Double '==' converts types behind your back ('5' == 5 is true).",
          fixHint: "Use strict triple equals '===' so types must match exactly."
        });
      }
      if (/\bvar\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/.test(line)) {
        issues.push({
          kind: "OUTDATED HABIT",
          line: lineNum,
          title: "OLD 'var' KEYWORD DETECTED!",
          message: "'var' has confusing hoisting rules that create subtle bugs.",
          fixHint: "Use 'let' (for changing values) or 'const' (for unchanging values)."
        });
      }
      if (/\bwhile\s*\(\s*true\s*\)/.test(line)) {
        issues.push({
          kind: "LOOP NEVER STOPS!",
          line: lineNum,
          title: "ENDLESS WHILE LOOP!",
          message: "This loop will freeze your browser or Node.js thread.",
          fixHint: "Add a condition or 'break;' inside the loop body."
        });
      }

      if (lang === "typescript") {
        if (/:\s*any\b/.test(line)) {
          issues.push({
            kind: "TRICKY PITFALL",
            line: lineNum,
            title: "THE ': any' ESCAPE HATCH!",
            message: "': any' disables TypeScript's safety powers and behaves like raw JS.",
            fixHint: "Give it a real type like ': string', ': number', or an interface."
          });
        }
        if (/[a-zA-Z0-9_]!\.[a-zA-Z0-9_]/.test(line)) {
          issues.push({
            kind: "QUIET BUG",
            line: lineNum,
            title: "UNSAFE FORCE-NOT-NULL (!.) OPERATOR!",
            message: "Using '!' forces TypeScript to trust you, but crashes if the object is null.",
            fixHint: "Use optional chaining '?.' or an 'if' check instead."
          });
        }
      }
    }

    // --- LUAU (ROBLOX) ENGINE ---
    if (lang === "luau") {
      if (line.startsWith("--")) return;
      if (/^while\s+true\s+do/.test(line) && !line.includes("task.wait") && !line.includes("wait")) {
        issues.push({
          kind: "LOOP NEVER STOPS!",
          line: lineNum,
          title: "ROBLOX FREEZING LOOP!",
          message: "A 'while true do' loop without a wait will crash the Roblox client immediately!",
          fixHint: "Add 'task.wait()' inside your loop body."
        });
      }
      if (/==\s*nil\b/.test(line)) {
        issues.push({
          kind: "TRICKY PITFALL",
          line: lineNum,
          title: "EXPLICIT NIL COMPARISON",
          message: "In Luau, checking 'not x' is safer and idiomatic.",
          fixHint: "Try: if not player then"
        });
      }
    }

    // --- HTML ENGINE ---
    if (lang === "html") {
      if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(line)) {
        issues.push({
          kind: "TRICKY PITFALL",
          line: lineNum,
          title: "IMAGE MISSING 'alt' DESCRIPTION!",
          message: "Screen readers and search engines cannot tell what this image shows.",
          fixHint: "Add an alt tag, e.g. <img src='hero.png' alt='Game Hero'>"
        });
      }
      if (/<(center|font|marquee|blink)\b/i.test(line)) {
        issues.push({
          kind: "OUTDATED HABIT",
          line: lineNum,
          title: "OUTDATED HTML TAG DETECTED!",
          message: "Modern websites use CSS flexbox and styling instead of deprecated tags.",
          fixHint: "Use CSS style='text-align: center;' instead of <center>"
        });
      }
    }
  });

  return issues;
}

export function formatReport(lang, code) {
  const issues = analyzeCode(lang, code);
  if (issues.length === 0) {
    return (
      `============================================================\n` +
      `   🌟 ALL GOOD! YOUR ${lang.toUpperCase()} CODE IS CLEAN & SAFE! 🌟  \n` +
      `============================================================\n` +
      `No bugs, loops, or tricky pitfalls spotted. Keep building! 🚀\n`
    );
  }

  const out = [
    `============================================================`,
    `             🚀 CODECOACH ${lang.toUpperCase()} REVIEW               `,
    `============================================================\n`
  ];

  issues.forEach((i, idx) => {
    out.push(`👉 Problem #${idx + 1} (Line ${i.line}) - [${i.kind}]`);
    out.push(`   ⚠️  ${i.title}`);
    out.push(`   💡 ${i.message}`);
    out.push(`   🛠️  TRY THIS: ${i.fixHint}\n`);
  });

  out.push(`You're doing great! Small fixes make you a master developer! 💻✨`);
  return out.join("\n");
}
