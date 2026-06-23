// TypeScript interface for the shared state passed through the watchlist flow.
// Tracks user input, conversation messages, mood analysis, genre preferences,
// energy level, movie results from each agent stage, and the final trust report.

export interface WatchlistState {
  userInput: string;
  messages: string[];
  mood?: string;
  preferredGenres?: string[];
  energyLevel?: string;
  trendingMovies?: unknown[];
  availableMovies?: unknown[];
  researchResults?: string;
  trustReport?: string;
}
