import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../../App';
import { api } from '../../services/api';
import MessageBubble from '../MessageBubble/MessageBubble'
import { FiSend } from 'react-icons/fi';

export default function ChatInterface() {
  const { chatHistory, setChatHistory, disclaimerAccepted } = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, scrollToBottom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || input.length > 500 || !disclaimerAccepted) return;

    const userMsg = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/chat/message', { message: input });
      setChatHistory(prev => [...prev, res.data]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border h-[500px] flex flex-col">
      <div className="p-3 border-b">
        <h3 className="font-medium text-gray-800">HealthCare Chat</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatHistory.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            placeholder="Ask about medications, diagnosis, labs..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            maxLength={500}
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            aria-label="Send message"
          >
            <FiSend />
          </button>
        </div>
        <div className="text-right text-xs text-gray-500 mt-1">{input.length}/500</div>
      </form>
    </div>
  );
}