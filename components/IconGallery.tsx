import React from 'react';
import { GeneratedIcon } from '../types';

interface IconGalleryProps {
  icons: GeneratedIcon[];
  onEdit: (icon: GeneratedIcon) => void; // New prop for edit functionality
}

const IconGallery: React.FC<IconGalleryProps> = ({ icons, onEdit }) => {
  const handleDownload = (icon: GeneratedIcon) => {
    const link = document.createElement('a');
    link.href = icon.url;
    // Sanitize prompt for filename
    const filename = `icon-${icon.prompt.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (icons.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8 p-4 bg-white rounded-lg shadow max-w-xl mx-auto" role="status">
        <p>No icons generated yet. Use the form to create your first icon!</p>
        <p className="mt-2 text-sm text-gray-500">
          Remember to select your Gemini API Key if prompted. Learn more about billing <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">here</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 md:p-8 bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto" aria-live="polite">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Generated Icons</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {icons.map((icon) => (
          <div key={icon.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center bg-gray-50 hover:shadow-md transition-shadow duration-200" aria-label={`Icon: ${icon.prompt}`}>
            <img src={icon.url} alt={icon.prompt} className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-4 border border-gray-300 p-2 rounded-xl" />
            <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2">{icon.prompt}</p>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => onEdit(icon)}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                aria-label={`Edit icon ${icon.prompt}`}
              >
                Edit Icon
              </button>
              <button
                onClick={() => handleDownload(icon)}
                className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                aria-label={`Download icon ${icon.prompt}`}
              >
                Download PNG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconGallery;