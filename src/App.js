import React, { createContext, useContext, useState, useEffect } from 'react';
import { api} from './services/api';
import DocumentUpload from './components/DocumentUpload/DocumentUpload';
import DocumentList from './components/DocumentList/DocumentList';
import ChatInterface from './components/ChatInterface/ChatInterface';
import DocumentPreview from './components/DocumentPreview/DocumentPreview';
import MedicalDisclaimer from './components/MedicalDisclaimer/MedicalDisclaimer';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './App.css';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

function App() {
  const [documents, setDocuments] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [docsRes, chatRes] = await Promise.all([
          api.get('/documents'),
          api.get('/chat/history'),
        ]);
        setDocuments(docsRes.data);
        setChatHistory(chatRes.data);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const deleteDocument = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error('Failed to delete document:', err);
    
    }
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        documents,
        chatHistory,
        setDocuments,
        setChatHistory,
        disclaimerAccepted,
        setDisclaimerAccepted,
        deleteDocument,
      }}
    >
    
      <MedicalDisclaimer />

      
      <div className="max-w-7xl mx-auto p-4">
       
        <div className="mb-6 flex items-start gap-3 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <div>
            <strong>Your privacy matters:</strong> All documents are processed locally in your browser.
            No data is stored, shared, or sent to external servers.
          </div>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         
          <div className="lg:col-span-1 space-y-6">
            <DocumentUpload />
            <DocumentList />
          </div>

          
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          
          <div className="lg:col-span-1">
            <DocumentPreview />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
