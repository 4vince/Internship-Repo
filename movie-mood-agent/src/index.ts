// Entry point for the movie mood agent. Spawns the MCP server as a child
// process, waits for it to become ready, then runs the watchlist flow with
// a user-provided query from the CLI argument.

import "dotenv/config";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runWatchlistFlow } from "./flow.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_PORT = 8000;
const MCP_URL = `http://127.0.0.1:${MCP_PORT}/mcp`;

async function waitForServer(url: string, timeoutMs = 15000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, {
        method: "GET",
      });
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("MCP server did not start in time");
}

async function main() {
  const mcpServerPath = path.resolve(__dirname, "../../movie-mcp-server/src/server.ts");

  console.log("Starting MCP server...");
  const server = spawn("npx", ["tsx", mcpServerPath], {
    stdio: "pipe",
    shell: true,
    env: { ...process.env, MCP_PORT: String(MCP_PORT) },
  });
  server.stderr.on("data", (d) => process.stderr.write(`[MCP] ${d}`));

  process.on("exit", () => server.kill());
  process.on("SIGINT", () => { server.kill(); process.exit(); });

  await waitForServer(MCP_URL);
  console.log("MCP server ready.\n");

  try {
    const query = process.argv[2] || "a good movie to watch";
    const result = await runWatchlistFlow(query);
    console.log(result);
  } finally {
    server.kill();
  }
}

main().catch(console.error);
