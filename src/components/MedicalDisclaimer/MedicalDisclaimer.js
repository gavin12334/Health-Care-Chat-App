import React from 'react';
import { useAppContext } from '../../App';

export default function MedicalDisclaimer() {
  const { disclaimerAccepted, setDisclaimerAccepted } = useAppContext();

  if (disclaimerAccepted) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-red-600 mb-3">Medical Disclaimer</h2>
        <p className="text-gray-700 mb-2">
          This application provides informational responses based on your uploaded documents.
          <strong> It does not provide medical advice, diagnosis, or treatment.</strong>
        </p>
        <p className="text-gray-700 mb-3">
          Always consult your physician or other qualified health provider with any questions regarding a medical condition.
        </p>
        <div className="flex items-start mb-3">
          <input
            type="checkbox"
            id="accept-disclaimer"
            onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            className="mt-0.5 mr-2"
          />
          <label htmlFor="accept-disclaimer" className="text-sm text-gray-700">
            I understand this is for informational purposes only and not a substitute for professional medical advice.
          </label>
        </div>
        <div className="text-xs text-gray-500 border-t pt-2">
          Your data is processed securely and not stored beyond this session.
        </div>
      </div>
    </div>
  );
}