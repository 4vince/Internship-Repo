// index.ts
// Entry point — boots the app only.
// All logic lives in src/

import './src/flow.ts'; // registers the Genkit flow

const query = process.argv[2] || "a good movie";

console.log("Movie/Film Watchlist Curator\n");
console.log(`Query: "${query}"\n`);
console.log("Starting agents... (check src/flow.ts to run via Genkit)\n");

// To run directly without Genkit dev server, import and call the flow:
import('./src/flow.js').then(({ runWatchlistFlow }) => {
  runWatchlistFlow(query).then((result: string) => {
    console.log(result);
    console.log("\nDone.");
  });
});