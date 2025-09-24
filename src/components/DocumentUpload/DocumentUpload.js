import React, { useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useAppContext } from '../../App';
import { FiUpload } from 'react-icons/fi';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentUpload() {
  const { documents, setDocuments } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Validate file by extension (more reliable than MIME type)
  const validateFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) return 'Only PDF, DOCX, TXT allowed';
    if (file.size > MAX_SIZE) return 'File too large (max 10MB)';
    return null;
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  }, []);

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);
    await uploadFiles(files);
    e.target.value = ''; // reset input
  };

  const uploadFiles = async (files) => {
    setError('');
    setUploading(true);
    for (const file of files) {
      const err = validateFile(file);
      if (err) {
        setError(err);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
  
        const res = await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        setDocuments((prev) => [...prev, res.data]);
      } catch (err) {
        console.error(err);
        setError('Upload failed');
      }
    }
    setUploading(false);
  };
  

  return (
    <div className="bg-white p-4 rounded-lg border">
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Uploading...</p>
          </div>
        ) : (
          <>
            <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop files, or{' '}
              <label htmlFor="file-upload" className="text-blue-600 font-medium cursor-pointer">
                browse
              </label>
            </p>
            <p className="text-xs text-gray-500">PDF, DOCX, TXT • Max 10MB</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </>
        )}
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
      </div>
    </div>
  );
}
