const OpenAI = require('openai');

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function isThai(text) {
  return /[\u0E00-\u0E7F]/.test(text);
const model = process.env.MODEL || 'llama-3.1-8b-instant';


const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

function isThai(text) {
  return /[\u0E00-\u0E7F]/.test(text || '');
}

function extractTextFromResponse(response) {
  if (response?.output_text && typeof response.output_text === 'string') {
    return response.output_text.trim();
  }

  const output = Array.isArray(response?.output) ? response.output : [];
  const parts = [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const piece of content) {
      if (piece?.type === 'output_text' && typeof piece?.text === 'string') {
        parts.push(piece.text);
      }
    }
  }

  return parts.join('\n').trim();
}

async function generateDraft(problemDescription) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const respondInThai = isThai(problemDescription);
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  const respondInThai = isThai(problemDescription);
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  const safeProblemDescription = problemDescription || '';
  const languageInstruction = respondInThai
    ? 'Respond in Thai language only.'
    : 'Respond in English language only.';

  const prompt = `You are an assistant that writes professional complaint and support emails.
Detect the user language and respond in the same language.
${languageInstruction}

Problem description:
${problemDescription}

${languageInstruction}

Problem description:
${safeProblemDescription}

Write a concise, clear, polite draft that a user can edit.`;

  console.log('[openai] generating draft', {
    model,
    inputLength: problemDescription.length,
    inputLength: safeProblemDescription.length,
    language: respondInThai ? 'thai' : 'english',
  });

  try {
    const response = await client.responses.create({
      model,
      input: prompt,
    });

    const text = extractTextFromResponse(response);

    if (!text) {
      console.error('[openai] empty response text', {
        responseId: response?.id,
      });
      throw new Error('OpenAI response did not contain draft text.');
      throw new Error('Groq response did not contain draft text.');
    }

    console.log('[openai] draft generated', {
      responseId: response?.id,
      outputLength: text.length,
    });

    return text;
  } catch (error) {
    console.error('[openai] generation failed', {
      message: error?.message,
      status: error?.status,
      code: error?.code,
    });
    throw error;
  }
}

module.exports = {
  generateDraft,
};

