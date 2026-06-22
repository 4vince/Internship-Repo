import { ai } from "./ai.js";
import type { WatchlistState } from "./state.js";

export async function moodDetectorAgent(state: WatchlistState): Promise<Partial<WatchlistState>> {
  const result = await ai.generate({
    prompt: `Analyze the user's mood and preferences from their request: "${state.userInput}".
Return a JSON object with:
- mood: the user's mood
- preferredGenres: array of preferred movie genres
- energyLevel: "low", "medium", or "high"`,
  });
  return {
    mood: result.text,
    messages: [...state.messages, `Mood: ${result.text}`],
  };
}

export async function trendAnalyzerAgent(state: WatchlistState): Promise<Partial<WatchlistState>> {
  const result = await ai.generate({
    prompt: `Based on this mood analysis: "${state.mood}"
List trending movies that match these genres: ${state.preferredGenres?.join(", ")}
Return a list of trending movies.`,
  });
  return {
    trendingMovies: [result.text],
    messages: [...state.messages, `Trends: ${result.text}`],
  };
}

export async function libraryAgent(state: WatchlistState): Promise<Partial<WatchlistState>> {
  const result = await ai.generate({
    prompt: `Search for available movies matching: ${state.preferredGenres?.join(", ")}
Return a list of movies we have available.`,
  });
  return {
    availableMovies: [result.text],
    messages: [...state.messages, `Library: ${result.text}`],
  };
}

export async function researchAgent(query: string) {
  const result = await ai.generate({
    tools: [
      "shopping/search_products",
      "shopping/compare_products",
      "shopping/get_reviews",
    ],
    prompt: `You are a product research assistant.
For the query "${query}":
1. Search the catalog for matching products
2. If multiple results exist, compare them
3. Check reviews for each product
4. Give a clear recommendation with reasoning`,
  });
  return result.text;
}

export async function trustAgent(sellerId: string) {
  const result = await ai.generate({
    tools: ["shopping/check_seller"],
    prompt: `You are a trust & safety agent.
Check the legitimacy of seller "${sellerId}".
Report their rating, years active, and any complaints.`,
  });
  return result.text;
}
