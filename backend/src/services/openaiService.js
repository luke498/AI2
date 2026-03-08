const OpenAI = require('openai');

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateDraft(problemDescription) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const prompt = `You are an assistant that writes professional complaint and support emails.\n\nProblem description:\n${problemDescription}\n\nWrite a concise, clear, polite draft that a user can edit.`;

  const response = await client.responses.create({
    model,
    input: prompt,
    temperature: 0.7,
  });

  const text = response.output_text?.trim();
  if (!text) {
    throw new Error('OpenAI response did not contain draft text.');
  }

  return text;
}

module.exports = {
  generateDraft,
};
