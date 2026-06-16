import 'dotenv/config';
import {
  recommendMoviesFlow,
  compareMoviesFlow,
} from './flows.js';
import {
  displayMovieList,
  displayMovieComparison,
} from './display.js';

async function main() {

  // Demo 1 — Multiple Recommendations
  console.log('\n--- DEMO 1: Multiple Recommendations ---');
  const list = await recommendMoviesFlow({
    model: 'default',
    genre: 'Action',
    maxDuration: 150,
    includeActors: [],
  });
  displayMovieList(list);

  // Demo 2 — Compare two movies
  console.log('\n--- DEMO 2: Movie Comparison ---');
  const comparison = await compareMoviesFlow({
    movie1: 'The Dark Knight',
    movie2: 'Avengers: Endgame',
  });
  displayMovieComparison(comparison);

}

main().catch(console.error);