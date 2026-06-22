import { genkit } from "genkit";
import { ollama } from "genkitx-ollama";
import { mcpClient } from "genkitx-mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

const MCP_SERVER = "http://127.0.0.1:8000/mcp";

const shoppingMCP = mcpClient({
  name: "shopping",
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
    shoppingMCP,
  ],
  model: "ollama/llama3.2",
});
