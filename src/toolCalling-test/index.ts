import 'dotenv/config';
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY ?? false })],
  model: googleAI.model('gemini-2.0-flash'),
});

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err?.status === 'RESOURCE_EXHAUSTED' && attempt < maxRetries - 1) {
        const delay = Math.min(1000 * 2 ** attempt + Math.random() * 1000, 30000);
        console.log(`Rate limited. Retrying in ${Math.round(delay / 1000)}s... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

async function main() {

  console.log('Asking Gemini to call a tool...');

  const getCurrentDateTool = ai.defineTool(
    {
      name: 'getCurrentDate',
      description: 'Returns the current date and time.',
      inputSchema: z.object({}),
      outputSchema: z.string(),
    },
    async () => new Date().toLocaleString()
  );

  const { text: dateText } = await withRetry(() =>
    ai.generate({
      prompt: 'What is the current date and time? Use the tool if needed.',
      tools: [getCurrentDateTool],
    })
  );

  console.log(dateText);
}

main().catch(console.error);