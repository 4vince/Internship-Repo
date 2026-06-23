// Genkit AI configuration. Sets up the Genkit instance with Ollama (llama3.2)
// as the LLM provider and an MCP client plugin that connects to the local movie
// MCP server for tool access.

import { genkit } from "genkit";
import { ollama } from "genkitx-ollama";
import { mcpClient } from "genkitx-mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

const MCP_SERVER = "http://127.0.0.1:8000/mcp";

const movieMCP = mcpClient({
  name: "movie",
  transport: new StreamableHTTPClientTransport(
    new URL(MCP_SERVER),
  ) as Transport,
});

export const ai = genkit({
  plugins: [
    ollama({
      serverAddress: "https://api.iamtzar.com",
      models: [{ name: "llama3.2", supports: { tools: true } }],
    }),
    movieMCP,
  ],
  model: "ollama/llama3.2",
});
