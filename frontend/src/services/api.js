const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

async function request(url, options = {}) {
  console.log('[api] request', { url, method: options.method || 'GET' });

  const response = await fetch(url, options);
  const rawBody = await response.text();

  let data = {};
  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('[api] failed to parse JSON response', {
        url,
        status: response.status,
        rawBody,
      });
      throw new Error(`Invalid response from server (${response.status}).`);
    }
  }

  if (!response.ok) {
    const message = data.error || `Request failed: ${response.status}`;
    console.error('[api] request failed', { url, status: response.status, message });
    throw new Error(message);
  }

  console.log('[api] request success', { url, status: response.status });
  return data;
}

export function buildProblemDescription({ messageType, tone, issueDescription }) {
  return `Message type: ${messageType}\nTone: ${tone}\nIssue description: ${issueDescription}`;
}

export function submitDraft(problemDescription) {
  return request('/submit', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ problemDescription }),
  });
}

export function saveDraft({ requestId, editedDraft }) {
  return request('/save', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ requestId, editedDraft }),
  });
}

export function getHistory() {
  return request('/history');
}

export function sendFeedback({ requestId, useful }) {
  return request('/feedback', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      requestId,
      rating: useful ? 5 : 1,
      comment: useful ? 'Useful output' : 'Not useful output',
    }),
  });
}
