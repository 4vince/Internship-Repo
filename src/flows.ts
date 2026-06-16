import 'dotenv/config';
import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";
import { MovieComparisonSchema, MovieListSchema, schema } from "./schema.js";


const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.0-flash'), 
});

// Flow 1 — Movie recommendations
export const recommendMoviesFlow = ai.defineFlow(
  {
    name: 'recommendMovies',
    inputSchema: schema,
    outputSchema: MovieListSchema,
  },
  async (input) => {
    const prompt = `Based on the following preferences, recommend a list of movies:
- Genre: ${input.genre}
- Maximum Duration: ${input.maxDuration} minutes
- Include Actors: ${input.includeActors.join(', ')}
Provide a list of movie recommendations, top picks, and a summary.`;

    const { output } = await ai.generate({
      prompt,
      output: { schema: MovieListSchema }, 
    });

    if (!output) throw new Error('Failed to generate movie recommendations');

    return output; 
  }
);

// Flow 2 — Movie comparison
export const compareMoviesFlow = ai.defineFlow(
  {
    name: 'compareMovies',
    inputSchema: z.object({
      movie1: z.string().describe('First movie title'),  
      movie2: z.string().describe('Second movie title'),
    }),
    outputSchema: MovieComparisonSchema,
  },
  async (input) => {
    const prompt = `Compare these two movies head to head:
Movie 1: ${input.movie1}
Movie 2: ${input.movie2}
Provide a comparison highlighting the strengths and weaknesses of each movie.`;

    const { output } = await ai.generate({
      prompt,
      output: { schema: MovieComparisonSchema }, 
    });

    if (!output) throw new Error('Failed to generate movie comparison');

    return output; 
  }
);