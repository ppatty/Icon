
import React, { useState } from 'react';
import { IconStyle, IconShape } from '../types';

interface IconGeneratorFormProps {
  onGenerate: (prompt: string, style: IconStyle, shape: IconShape, color: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const IconGeneratorForm: React.FC<IconGeneratorFormProps> = ({ onGenerate, isLoading, error }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<IconStyle>(IconStyle.MATERIAL);
  const [shape, setShape] = useState<IconShape>(IconShape.SQUIRCLE);
  const [color, setColor] = useState<string>('#4F46E5'); // Default purple

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate(prompt, style, shape, color);
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-xl max-w-lg w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Design Your Icon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Icon Description (e.g., 'A calculator', 'a cute dog head', 'a chat bubble')
          </label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., mail app, camera, game controller"
          />
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700">
            Style
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as IconStyle)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {Object.values(IconStyle).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="shape" className="block text-sm font-medium text-gray-700">
            Shape
          </label>
          <select
            id="shape"
            value={shape}
            onChange={(e) => setShape(e.target.value as IconShape)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {Object.values(IconShape).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Primary Color
          </label>
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-100 p-2 rounded-md">
            Error: {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Icon'
          )}
        </button>
      </form>
    </div>
  );
};

export default IconGeneratorForm;
