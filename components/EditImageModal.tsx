import React from 'react';
import { GeneratedIcon } from '../types';

interface EditImageModalProps {
  icon: GeneratedIcon | null;
  editingPrompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
}

const EditImageModal: React.FC<EditImageModalProps> = ({
  icon,
  editingPrompt,
  onPromptChange,
  onSubmit,
  onClose,
  isLoading,
  error,
}) => {
  if (!icon) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-icon-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h3 id="edit-icon-modal-title" className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Edit Icon
        </h3>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
          aria-label="Close edit modal"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center mb-6">
          <img
            src={icon.url}
            alt={`Editing: ${icon.prompt}`}
            className="w-32 h-32 object-contain border border-gray-300 p-2 rounded-xl shadow-sm mb-4"
          />
          <p className="text-sm text-gray-600 text-center line-clamp-2" aria-live="polite">
            Original prompt: {icon.prompt}
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="editingPrompt" className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to change?
          </label>
          <input
            type="text"
            id="editingPrompt"
            value={editingPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 'add a retro filter', 'make it metallic', 'remove the background'"
            aria-required="true"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-100 p-2 rounded-md mb-4" role="alert">
            Error: {error}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            disabled={isLoading}
            aria-disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !editingPrompt.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            aria-disabled={isLoading || !editingPrompt.trim()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Applying...
              </span>
            ) : (
              'Apply Edit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditImageModal;