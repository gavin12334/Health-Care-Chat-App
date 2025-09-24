import MockAdapter from 'axios-mock-adapter';
import { api } from './api';

let documents = [
  {
    id: '1',
    name: 'discharge_summary.pdf',
    type: 'application/pdf',
    size: 245760,
    uploadDate: '2024-09-20T10:30:00Z',
    status: 'processed',
  },
];

let chatHistory = [
  {
    id: '1',
    type: 'user',
    content: 'What medications were prescribed?',
    timestamp: '2024-09-20T11:00:00Z',
  },
  {
    id: '2',
    type: 'system',
    content:
      'Based on the discharge summary, the following medications were prescribed: Lisinopril 10mg daily, Atorvastatin 20mg nightly.',
    timestamp: '2024-09-20T11:00:15Z',
    sources: ['discharge_summary.pdf - Page 2'],
  },
];

let nextDocId = 2;
let nextMsgId = 3;

const mock = new MockAdapter(api, { delayResponse: 500 });

// --- DOCUMENTS ---
mock.onPost('/api/documents/upload').reply(() => {
  const newDoc = {
    id: String(nextDocId++),
    name: `document_${nextDocId - 1}.pdf`,
    type: 'application/pdf',
    size: 180000,
    uploadDate: new Date().toISOString(),
    status: 'processed',
  };
  documents.push(newDoc);
  return [200, newDoc];
});

mock.onGet('/api/documents').reply(() => {
  return [200, documents];
});

mock.onDelete(/\/api\/documents\/\d+/).reply((config) => {
  const id = config.url.split('/').pop();
  documents = documents.filter((d) => d.id !== id);
  return [204];
});


mock.onPost('/api/chat/message').reply((config) => {
  const { message } = JSON.parse(config.data);
  const lower = message.toLowerCase();

  let content = "I've analyzed your documents. ";
  const sources = [];

  if (lower.includes('medication') || lower.includes('prescribed')) {
    content +=
      'Based on the discharge summary, the following medications were prescribed: Lisinopril 10mg daily, Atorvastatin 20mg nightly.';
    sources.push('discharge_summary.pdf - Page 2');
  } else if (lower.includes('diagnosis')) {
    content += 'The primary diagnosis was Type 2 Diabetes Mellitus with peripheral neuropathy.';
    sources.push('discharge_summary.pdf - Page 1');
  } else if (lower.includes('allerg')) {
    content += 'No known drug allergies were documented.';
    sources.push('discharge_summary.pdf - Page 1');
  } else if (lower.includes('lab') || lower.includes('result')) {
    content += 'Recent lab results: HbA1c 7.2%, LDL 110 mg/dL.';
    sources.push('discharge_summary.pdf - Page 3');
  } else if (lower.includes('treatment') || lower.includes('plan')) {
    content += 'Treatment plan: medication management, diabetic diet, follow-up in 2 weeks.';
    sources.push('discharge_summary.pdf - Page 2');
  } else {
    content += 'Please ask about medications, diagnosis, labs, or treatment plan.';
    sources.push('discharge_summary.pdf - Multiple pages');
  }

  const userMessage = {
    id: String(nextMsgId++),
    type: 'user',
    content: message,
    timestamp: new Date().toISOString(),
  };

  const systemMessage = {
    id: String(nextMsgId++),
    type: 'system',
    content,
    timestamp: new Date().toISOString(),
    sources,
  };

  chatHistory.push(userMessage, systemMessage);

  return [200, systemMessage];
});

mock.onGet('/api/chat/history').reply(() => {
  return [200, chatHistory];
});

export default mock;
