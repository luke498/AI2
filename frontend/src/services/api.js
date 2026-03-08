const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
}

export function buildProblemDescription({ messageType, tone, issueDescription }) {
  return `Message type: ${messageType}\nTone: ${tone}\nIssue description: ${issueDescription}`;
}

export function submitDraft(problemDescription) {
  return request('/submit', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ problemDescription })
  });
}

export function saveDraft({ requestId, editedDraft }) {
  return request('/save', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ requestId, editedDraft })
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
      comment: useful ? 'Useful output' : 'Not useful output'
    })
  });
}
