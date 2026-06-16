import 'dotenv/config';
import { z } from 'genkit';

export const schema = z.object({
    model: z.string().describe('Current Vibe'),
    genre: z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Classical','Any Film']).default('Any Film').describe('Genre of Movie'),
    maxDuration: z.number().int().positive().default(120).describe('Maximum Duration of Movie in Minutes'),
    includeActors: z.array(z.string()).default([]).describe('List of Actors to Include')
});

// This schema defines the structure of the input data for generating movie recommendations based on the user's preferences. It includes fields for the model to use, the genre of movies, maximum duration, and a list of actors to include in the recommendations.
export const MovieSchema = z.object({
    title: z.string().describe('Title of the Movie'),
    genre: z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Classical']).describe('Genre of the Movie'),
    duration: z.number().int().positive().describe('Duration of the Movie in Minutes'),
    actors: z.array(z.string()).describe('List of Actors in the Movie')
});

// This schema defines the structure of a list of movie recommendation, including the title, genre, duration, and actors involved in the movie.
export const MovieListSchema = z.object({
    recommendations: z.array(MovieSchema).describe('List of Movie Recommendations'),
    topPicks: z.array(MovieSchema).describe('Top Picks for the User'),
    movieSummary: z.string().describe('Summary of the Movie Recommendations')
});

// Movie Comparison Schema
export const MovieComparisonSchema = z.object({
    movie1: MovieSchema.describe('First Movie for Comparison'),
    movie2: MovieSchema.describe('Second Movie for Comparison'),
    comparisonResult: z.string().describe('Result of the Movie Comparison')
});