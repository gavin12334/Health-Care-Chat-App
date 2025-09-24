import React from 'react';
import { FiUser, FiCpu } from 'react-icons/fi';

export default function MessageBubble({ message }) {
  const isUser = message.type === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] md:max-w-[65%] px-4 py-2 rounded-2xl ${
        isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        <div className="flex items-start gap-2">
          {!isUser && <FiCpu className="mt-0.5 flex-shrink-0" />}
          <div>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.sources && (
              <div className="mt-2 text-xs">
                <p className="font-medium text-gray-700">Sources:</p>
                {message.sources.map((src, i) => (
                  <span
                    key={i}
                    className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 mr-1 cursor-pointer hover:bg-blue-200"
                    onClick={() => alert(`Viewing context from: ${src}`)}
                    role="button"
                    tabIndex={0}
                  >
                    {src}
                  </span>
                ))}
              </div>
            )}
          </div>
          {isUser && <FiUser className="mt-0.5 flex-shrink-0" />}
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'} text-right`}>
          {time}
        </div>
      </div>
    </div>
  );
}