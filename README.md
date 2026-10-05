# 🚀 CodeCoach 2.0 (Node.js & TypeScript Core)

> **Unified Multi-Language Kid-Friendly Static Analysis Engine**

Rebuilt from the ground up using **TypeScript** for the analysis engine and **Node.js** as the backend server.

---

## 🌟 Supported Languages
1. **Python**: Catches accidental `=` assignment, unparenthesized `print`, and endless `while True:` loops.
2. **TypeScript**: Warns against `: any` escape hatches, force-not-null assertion crashes (`!.`), and untyped parameters.
3. **JavaScript**: Detects runaway browser loops (`while(true)`), loose `==` equality, and legacy `var`.
4. **Luau (Roblox)**: Warns about Roblox client-crashing `while true do` loops missing `task.wait()`.
5. **HTML**: Flags accessibility gaps (missing `alt` attributes) and deprecated tags (`<center>`, `<font>`, `<marquee>`).

---

## 🚀 Quick Start
```bash
# Double-click to launch server and open web editor:
START_SERVER.bat

# Or run via terminal:
node server.js
```
Navigate to **`http://localhost:4200`** in your browser.

---

## 🛠️ REST API Specification
- `GET /api/health` -> System health and engine version
- `POST /api/analyze` -> Analyzes code payload:
```json
{
  "lang": "typescript",
  "code": "let score: any = 100;"
}
```

---

## 💬 Community
Join the Vortex Discord to claim your permanent **`💎 First 100 Badge`**:
👉 **[discord.gg/QtyBucygQ6](https://discord.gg/QtyBucygQ6)**
