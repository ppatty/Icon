import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import IconGeneratorForm from './components/IconGeneratorForm';
import IconPackGeneratorForm from './components/IconPackGeneratorForm'; // New import
import IconGallery from './components/IconGallery';
import EditImageModal from './components/EditImageModal'; // New import
import { ensureApiKeySelected, generateIconImage, editIconImage, generateIconPack } from './services/geminiService'; // New imports
import { GeneratedIcon, IconStyle, IconShape } from './types';
import { ApiKeyError } from './errors'; // Import custom error

function App() {
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState<boolean>(false);

  // State for image editing modal
  const [editingIcon, setEditingIcon] = useState<GeneratedIcon | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<string>('');
  const [isEditingLoading, setIsEditingLoading] = useState<boolean>(false);
  const [editingError, setEditingError] = useState<string | null>(null);

  // State for icon pack generation
  const [isPackLoading, setIsPackLoading] = useState<boolean>(false);
  const [packError, setPackError] = useState<string | null>(null);

  // Function to handle API key selection (if window.aistudio is available)
  const handleApiKeySelection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await ensureApiKeySelected();
      if (success) {
        setApiKeyReady(true);
      } else {
        setError("Failed to select API key. Please try again.");
      }
    } catch (e: any) {
      setError(`Error checking/selecting API key: ${e.message || 'Unknown error'}`);
      setApiKeyReady(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check API key status on component mount
  useEffect(() => {
    // Only attempt to check/select API key if window.aistudio exists
    if (typeof window !== 'undefined' && window.aistudio) {
      handleApiKeySelection();
    } else {
      // If window.aistudio is not available (e.g., during local development),
      // assume API_KEY is set via environment and allow access.
      setApiKeyReady(true);
    }
  }, [handleApiKeySelection]); // Dependency array to prevent infinite loop

  const handleGenerate = async (
    prompt: string,
    style: IconStyle,
    shape: IconShape,
    color: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const imageUrls = await generateIconImage(prompt, style, shape, color);
      if (imageUrls && imageUrls.length > 0) {
        setGeneratedIcons((prevIcons) => [
          { id: uuidv4(), url: imageUrls[0], prompt: prompt },
          ...prevIcons, // Add new icon at the beginning
        ]);
      } else {
        setError("No image URL received from the API.");
      }
    } catch (e: any) {
      if (e instanceof ApiKeyError) {
        setError("API Key Issue: Please select or re-select your Gemini API key.");
        setApiKeyReady(false); // Reset to prompt API key selection
      } else {
        setError(`Generation failed: ${e.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Image Editing Handlers ---
  const handleEditClick = (icon: GeneratedIcon) => {
    setEditingIcon(icon);
    setEditingPrompt(''); // Clear previous prompt
    setEditingError(null);
  };

  const handleCloseEditModal = () => {
    setEditingIcon(null);
    setEditingPrompt('');
    setEditingError(null);
  };

  const handleApplyEdit = async () => {
    if (!editingIcon || !editingPrompt.trim()) return;

    setIsEditingLoading(true);
    setEditingError(null);

    try {
      // Extract raw base64 and mime type from the data URI
      const parts = editingIcon.url.split(';base64,');
      if (parts.length !== 2) {
        throw new Error("Invalid image data URI format.");
      }
      const mimeType = parts[0].replace('data:', '');
      const base64Data = parts[1];

      const editedImageUrl = await editIconImage(base64Data, mimeType, editingPrompt);
      setGeneratedIcons((prevIcons) => [
        { id: uuidv4(), url: editedImageUrl, prompt: `Edited: ${editingIcon.prompt} (${editingPrompt})` },
        ...prevIcons, // Add new edited icon at the beginning
      ]);
      handleCloseEditModal(); // Close modal on success
    } catch (e: any) {
      if (e instanceof ApiKeyError) {
        setEditingError("API Key Issue: Please select or re-select your Gemini API key.");
        setApiKeyReady(false); // Reset to prompt API key selection
      } else {
        setEditingError(`Editing failed: ${e.message || 'Unknown error'}`);
      }
    } finally {
      setIsEditingLoading(false);
    }
  };

  // --- Icon Pack Generation Handlers ---
  const handleGeneratePack = async (
    themePrompt: string,
    style: IconStyle,
    shape: IconShape,
    color: string,
  ) => {
    setIsPackLoading(true);
    setPackError(null);
    try {
      const newIcons = await generateIconPack(themePrompt, style, shape, color);
      if (newIcons && newIcons.length > 0) {
        setGeneratedIcons((prevIcons) => [...newIcons, ...prevIcons]); // Add new pack icons at the beginning
      } else {
        setPackError("No icons were generated for the pack.");
      }
    } catch (e: any) {
      if (e instanceof ApiKeyError) {
        setPackError("API Key Issue: Please select or re-select your Gemini API key.");
        setApiKeyReady(false); // Reset to prompt API key selection
      } else {
        setPackError(`Icon pack generation failed: ${e.message || 'Unknown error'}`);
      }
    } finally {
      setIsPackLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 tracking-tight leading-tight">
          Gemini Icon Pack Generator
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Unleash your creativity and design custom app icons for your Android device with AI.
        </p>
      </header>

      {!apiKeyReady && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow-sm max-w-lg mx-auto" role="alert" aria-live="assertive">
          <p className="font-bold">API Key Required</p>
          <p className="mt-1 text-sm">
            Please select your Gemini API Key to use this application. This helps ensure secure and authenticated access to the AI models.
            <br />
            Learn more about billing <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">here</a>.
          </p>
          {error && <p className="text-red-600 text-sm mt-2">Error: {error}</p>}
          <button
            onClick={handleApiKeySelection}
            disabled={isLoading}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            aria-disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking API Key...
              </span>
            ) : (
              'Select Gemini API Key'
            )}
          </button>
        </div>
      )}

      {apiKeyReady && (
        <>
          <IconGeneratorForm onGenerate={handleGenerate} isLoading={isLoading} error={error} />
          <IconPackGeneratorForm onGeneratePack={handleGeneratePack} isLoading={isPackLoading} error={packError} /> {/* New Pack Generator Form */}
          <IconGallery icons={generatedIcons} onEdit={handleEditClick} />
          <EditImageModal
            icon={editingIcon}
            editingPrompt={editingPrompt}
            onPromptChange={setEditingPrompt}
            onSubmit={handleApplyEdit}
            onClose={handleCloseEditModal}
            isLoading={isEditingLoading}
            error={editingError}
          />
        </>
      )}

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Powered by Gemini API & Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;