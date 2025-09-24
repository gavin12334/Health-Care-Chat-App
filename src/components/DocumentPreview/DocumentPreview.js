import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../App';
import { FiSearch, FiFileText } from 'react-icons/fi';

export default function DocumentPreview() {
  const { documents } = useAppContext();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const mockContent = `Discharge Summary

Page 1:
Patient diagnosed with Type 2 Diabetes Mellitus.
No known drug allergies.

Page 2:
Medications: Lisinopril 10mg daily, Atorvastatin 20mg nightly.
Treatment plan: medication management, diabetic diet, follow-up in 2 weeks.

Page 3:
Lab results: HbA1c 7.2%, LDL 110 mg/dL.`;

  useEffect(() => {
    if (documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    }
  }, [documents, selectedDoc]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const lines = mockContent.split('\n');
    const matches = lines
      .map((line, i) => ({
        line: i + 1,
        text: line,
        highlighted: line.replace(
          new RegExp(`(${searchQuery})`, 'gi'),
          '<mark class="bg-yellow-200">$1</mark>'
        ),
      }))
      .filter(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()));
    setResults(matches);
  };

  return (
    <div className="bg-white rounded-lg border h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="font-medium text-gray-800">Document Preview</h3>
        {documents.length > 1 && (
          <select
            value={selectedDoc?.id || ''}
            onChange={(e) => {
              const doc = documents.find(d => d.id === e.target.value);
              setSelectedDoc(doc);
            }}
            className="mt-2 w-full p-2 text-sm border rounded"
          >
            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="p-3 border-b flex gap-2">
        <input
          type="text"
          placeholder="Search in document..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-gray-100 p-1 rounded hover:bg-gray-200"
          aria-label="Search"
        >
          <FiSearch />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 text-sm">
        {searchQuery ? (
          results.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-2">Found {results.length} result(s):</p>
              {results.map((res, i) => (
                <div key={i} className="mb-2 p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-500">Line {res.line}</span>
                  <div dangerouslySetInnerHTML={{ __html: res.highlighted }} className="mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No results found.</p>
          )
        ) : (
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FiFileText />
              <span>{selectedDoc?.name || 'No document'}</span>
            </div>
            <pre className="whitespace-pre-wrap text-gray-800 font-sans text-xs">
              {selectedDoc ? mockContent : 'Upload a document to preview.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}