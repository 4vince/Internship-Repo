import 'dotenv/config';
import type { schema, MovieSchema, MovieListSchema, MovieComparisonSchema } from "./schema.js";
import type { z } from "genkit";

type MovieList = z.infer<typeof MovieListSchema>;
type MovieComparison = z.infer<typeof MovieComparisonSchema>;
type Movie = z.infer<typeof MovieSchema>;


export function displayMovieList(movieList: MovieList){
  console.log('Recommended Movies:');
  movieList.recommendations.forEach((movie: Movie) => {
    console.log(`- ${movie.title} (${movie.duration} min)`);
  });
}

export function displayMovieComparison(comparison: MovieComparison){
  console.log('Movie Comparison:');
  console.log(`Movie 1: ${comparison.movie1.title} (${comparison.movie1.genre})`);
  console.log(`Movie 2: ${comparison.movie2.title} (${comparison.movie2.genre})`);
  console.log('Comparison Result:');
  console.log(comparison.comparisonResult);
}

export function displayMovieDetails(movie: Movie){
  console.log(`Title: ${movie.title}`);
  console.log(`Genre: ${movie.genre}`);
  console.log(`Duration: ${movie.duration} minutes`);
  console.log(`Actors: ${movie.actors.join(', ')}`);
}

export function displayMovieSummary(summary: string){
  console.log('Movie Summary:');
  console.log(summary);
}   
