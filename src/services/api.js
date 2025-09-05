import axios from 'axios';

const API_ROOT = 'https://melbinjp-docqa.hf.space';

const api = axios.create({
  baseURL: API_ROOT,
});

export const createSession = async () => {
  const response = await api.post('/sessions');
  return response.data;
};

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // Simply return a successful response
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;
    const isSessionEndpoint = originalRequest.url.includes('/sessions/');
    const isCreatingSession = originalRequest.url.endsWith('/sessions');

    // Check if it's a 404 on a session endpoint, but not on the /sessions create endpoint itself
    // And also check a flag to prevent infinite loops if session creation fails repeatedly.
    if (status === 404 && isSessionEndpoint && !isCreatingSession && !originalRequest._retry) {
      console.log('Session expired or not found. Attempting to create a new one.');
      originalRequest._retry = true; // Mark that we've tried to refresh the session

      try {
        // Step 1: Create a new session
        const newSession = await createSession();
        const newSessionId = newSession.session_id;
        console.log('New session created:', newSessionId);

        // Step 2: Update localStorage
        localStorage.setItem('sessionId', newSessionId);

        // Step 3: Dispatch a custom event to notify the app of the new session
        window.dispatchEvent(new CustomEvent('session-updated'));

        // Step 4: Update the original request's URL with the new session ID
        const oldSessionId = originalRequest.url.split('/')[2];
        originalRequest.url = originalRequest.url.replace(oldSessionId, newSessionId);

        // Step 5: Retry the original request
        console.log('Retrying original request with new session ID:', originalRequest.url);
        return api(originalRequest);
      } catch (e) {
        console.error('Failed to create a new session or retry the request.', e);
        // If creating a new session fails, we should probably inform the user.
        // For now, we'll just reject the promise.
        return Promise.reject(e);
      }
    }

    // For all other errors, just pass them on
    return Promise.reject(error);
  }
);


export const ingestFile = async (sessionId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/sessions/${sessionId}/ingest`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const ingestUrl = async (sessionId, url) => {
  // The backend expects a JSON payload for URL ingestion
  const response = await api.post(`/sessions/${sessionId}/ingest`, { url }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data;
};

export const query = async (sessionId, q, doc_ids = null) => {
    const payload = { q };
    if (doc_ids) {
        payload.doc_ids = doc_ids;
    }
    const response = await api.post(`/sessions/${sessionId}/query`, payload);
    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data;
};

export const deleteDocument = async (sessionId, docId) => {
    const response = await api.delete(`/sessions/${sessionId}/documents/${docId}`);
    return response.data;
};

export default api;
