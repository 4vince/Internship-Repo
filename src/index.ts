import "dotenv/config";
import { spawn } from "node:child_process";
import { runWatchlistFlow } from "./flow.js";

const MCP_PORT = 8000;
const MCP_URL = `http://127.0.0.1:${MCP_PORT}/mcp`;

async function waitForServer(url: string, timeoutMs = 15000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json, text/event-stream" },
      });
      // Any response (including 4xx) means the server is up
      return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("MCP server did not start in time");
}

async function main() {
  const serverPath = "D:/Intern_practice_agent/MCP/server.py";
  const python = "C:/Users/User/AppData/Local/Python/bin/python.exe";

  console.log("Starting MCP server...");
  const server = spawn(python, [serverPath], { stdio: "pipe" });
  server.stdout.on("data", (d) => process.stdout.write(`[MCP] ${d}`));
  server.stderr.on("data", (d) => process.stderr.write(`[MCP] ${d}`));

  process.on("exit", () => server.kill());
  process.on("SIGINT", () => { server.kill(); process.exit(); });

  await waitForServer(MCP_URL);
  console.log("MCP server ready.\n");

  try {
    const query = process.argv[2] || "a good laptop";
    const result = await runWatchlistFlow(query);
    console.log(result);
  } finally {
    server.kill();
  }
}

main().catch(console.error);
