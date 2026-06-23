import { ai } from "./ai.js";
import { z } from "genkit";
import {
  researchAgent,
  moodDetectorAgent,
  trendAnalyzerAgent,
  libraryAgent,
  trustAgent,
} from "./graph.js";
import type { WatchlistState } from "./state.js";

export const watchlistFlow = ai.defineFlow(
  {
    name: "watchlistFlow",
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (userInput: string) => {
    const state: WatchlistState = {
      userInput,
      messages: [],
    };

    console.log("--- Mood Detection Agent ---");
    const moodResult = await moodDetectorAgent(state);
    Object.assign(state, moodResult);
    console.log(state.mood);

    console.log("\n--- Trend Analyzer Agent ---");
    const trendResult = await trendAnalyzerAgent(state);
    Object.assign(state, trendResult);
    console.log(state.trendingMovies);

    console.log("\n--- Library Agent ---");
    const libraryResult = await libraryAgent(state);
    Object.assign(state, libraryResult);
    console.log(state.availableMovies);

    console.log("\n--- Research Agent ---");
    const researchResult = await researchAgent(state.userInput);
    state.researchResults = researchResult;
    console.log(state.researchResults);

    console.log("\n--- Studio Reputation Agent ---");
    const trustResult = await trustAgent("ST002");
    state.trustReport = trustResult;
    console.log(state.trustReport);

    return JSON.stringify(
      {
        query: state.userInput,
        mood: state.mood,
        preferredGenres: state.preferredGenres,
        energyLevel: state.energyLevel,
        trendingMovies: state.trendingMovies,
        availableMovies: state.availableMovies,
        research: state.researchResults,
        trustReport: state.trustReport,
        log: state.messages,
      },
      null,
      2,
    );
  },
);

export async function runWatchlistFlow(query: string): Promise<string> {
  return await watchlistFlow(query);
}
