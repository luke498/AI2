const OpenAI = require('openai');

const model = process.env.MODEL || 'openai/gpt-oss-20b';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function generateDraft(problemDescription) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  const prompt = `You are an assistant that writes professional complaint and support emails.

Respond in the same language as the user's input.
If the input is Thai, respond in Thai.
If the input is English, respond in English.

Problem description:
${problemDescription}

Write a concise, clear, polite draft that a user can edit.`;

  const response = await client.responses.create({
    model,
    input: prompt,
  });

  const text = response.output_text?.trim();

  if (!text) {
    throw new Error('Groq response did not contain draft text.');
  }

  return text;
}

module.exports = {
  generateDraft,
};