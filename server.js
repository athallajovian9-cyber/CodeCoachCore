// =============================================================================
// CodeCoach Backend Server (Node.js HTTP Server)
// Zero external dependencies - pure Node.js stdlib
// =============================================================================

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeCode, formatReport } from "./engine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4200;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.url === "/api/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", engine: "CodeCoach-Node-TS", version: "2.0.0" }));
    return;
  }

  // Code analysis API endpoint
  if (req.url === "/api/analyze" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const { lang = "python", code = "" } = JSON.parse(body);
        const issues = analyzeCode(lang, code);
        const report = formatReport(lang, code);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ lang, issueCount: issues.length, issues, report }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    });
    return;
  }

  // Serve Single-Page Frontend GUI
  if (req.url === "/" || req.url === "/index.html") {
    const indexPath = path.join(__dirname, "public", "index.html");
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fs.readFileSync(indexPath, "utf-8"));
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(`   🚀 CodeCoach Node.js & TypeScript Server Running!        `);
  console.log(`   URL: http://localhost:${PORT}                            `);
  console.log(`   API: http://localhost:${PORT}/api/analyze               `);
  console.log(`============================================================`);
});
