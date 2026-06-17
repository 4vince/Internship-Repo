import 'dotenv/config';
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY ?? false })],
  model: googleAI.model('gemini-2.0-flash'),
});

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

  const { text: dateText } = await ai.generate({
    prompt: 'What is the current date and time? Use the tool if needed.',
    tools: [getCurrentDateTool],
  });

  console.log(dateText);
}

main().catch(console.error);