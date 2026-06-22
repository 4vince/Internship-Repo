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
