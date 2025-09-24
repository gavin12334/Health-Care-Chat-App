import React from 'react';
import { useAppContext } from '../../App';
import { FiFile, FiTrash2 } from 'react-icons/fi';
import formatBytes from '../../utils/formatBytes';

export default function DocumentList() {
  const { documents, deleteDocument } = useAppContext();

  if (documents.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h3>
      <div className="space-y-2">
        {documents.map(doc => (
          <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <FiFile className="text-gray-500 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm truncate max-w-[120px]">{doc.name}</p>
                <p className="text-xs text-gray-500">
                  {formatBytes(doc.size)} • {doc.type.split('/')[1]?.toUpperCase() || 'FILE'} •{' '}
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => deleteDocument(doc.id)}
              className="text-gray-400 hover:text-red-500"
              aria-label="Delete document"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}