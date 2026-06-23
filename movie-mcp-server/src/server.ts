// MCP (Model Context Protocol) server entry point. Sets up an HTTP server that
// exposes movie tools (search, reviews, compare, check studio) via the MCP
// StreamableHTTP transport on port 8000.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { searchMovies } from "./tools/searchMovies.js";
import { getReviews } from "./tools/getReviews.js";

const PORT = parseInt(process.env["MCP_PORT"] ?? "8000", 10);
const MCP_PATH = "/mcp";

const server = new Server(
  { name: "movie-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "movie/search_movies",
      description: "Search the movie catalog by title, genre, or year",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
        },
        required: ["query"],
      },
    },
    {
      name: "movie/get_reviews",
      description: "Get critic reviews for a movie by its ID",
      inputSchema: {
        type: "object",
        properties: {
          movieId: { type: "string", description: "Movie ID" },
        },
        required: ["movieId"],
      },
    },
    {
      name: "movie/compare_movies",
      description: "Compare two movies side by side",
      inputSchema: {
        type: "object",
        properties: {
          movie1: { type: "string", description: "First movie title" },
          movie2: { type: "string", description: "Second movie title" },
        },
        required: ["movie1", "movie2"],
      },
    },
    {
      name: "movie/check_studio",
      description: "Check the reputation and history of a movie studio",
      inputSchema: {
        type: "object",
        properties: {
          studioId: { type: "string", description: "Studio ID" },
        },
        required: ["studioId"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "movie/search_movies": {
      const results = await searchMovies(args?.query as string);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }

    case "movie/get_reviews": {
      const reviews = await getReviews(args?.movieId as string);
      return {
        content: [{ type: "text", text: JSON.stringify(reviews, null, 2) }],
      };
    }

    case "movie/compare_movies": {
      const m1 = await searchMovies(args?.movie1 as string);
      const m2 = await searchMovies(args?.movie2 as string);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ movie1: m1, movie2: m2 }, null, 2),
        }],
      };
    }

    case "movie/check_studio": {
      const studios: Record<string, Record<string, unknown>> = {
        ST001: { name: "Universal Pictures", founded: 1912, boxOfficeRating: 8.5, academyAwards: 42 },
        ST002: { name: "Warner Bros.", founded: 1923, boxOfficeRating: 8.7, academyAwards: 58 },
        ST003: { name: "Walt Disney Studios", founded: 1923, boxOfficeRating: 9.1, academyAwards: 135 },
      };
      const studio = studios[args?.studioId as string] ?? { error: "Studio not found" };
      return {
        content: [{ type: "text", text: JSON.stringify(studio, null, 2) }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

const transport = new StreamableHTTPServerTransport();

const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("OK");
    return;
  }
  if (req.method === "POST" && req.url === MCP_PATH) {
    const buffers: Buffer[] = [];
    for await (const chunk of req) buffers.push(chunk);
    const body = Buffer.concat(buffers).toString();
    if (!body) {
      res.writeHead(400).end();
      return;
    }
    await transport.handleRequest(req, res, JSON.parse(body));
  } else {
    res.writeHead(405).end();
  }
});

httpServer.listen(PORT, () => {
  console.error(`Movie MCP server running at http://127.0.0.1:${PORT}${MCP_PATH}`);
});
