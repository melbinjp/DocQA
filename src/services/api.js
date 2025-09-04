import axios from 'axios';

const API_ROOT = 'https://melbinjp-docqa.hf.space';

const api = axios.create({
  baseURL: API_ROOT,
});

export const createSession = async () => {
  const response = await api.post('/sessions');
  return response.data;
};

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
  const response = await api.post(`/sessions/${sessionId}/ingest`, { url });
  return response.data;
};

export const query = async (sessionId, q, doc_ids = null) => {
    const payload = { q };
    if (doc_ids) {
        payload.doc_ids = doc_ids;
    }
    const response = await api.post(`/sessions/${sessionId}/query`, payload);
    return response.data;
};

export const deleteDocument = async (sessionId, docId) => {
    const response = await api.delete(`/sessions/${sessionId}/documents/${docId}`);
    return response.data;
};

export default api;
