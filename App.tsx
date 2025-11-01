
import React, { useState, useCallback, useEffect } from 'react';
import { Platform, Tone, PlatformConfig, GeneratedContent } from './types';
import { PLATFORM_OPTIONS, TONE_OPTIONS } from './constants';
import { generateContent } from './services/geminiService';
import { PlusIcon, TrashIcon, CopyIcon, CheckIcon, SparklesIcon } from './components/icons';

enum AppState {
  CONFIG,
  GENERATING,
  RESULTS,
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CONFIG);
  const [coreMessage, setCoreMessage] = useState<string>('');
  const [platformConfigs, setPlatformConfigs] = useState<PlatformConfig[]>([
    { id: crypto.randomUUID(), platform: Platform.Tweet, tone: Tone.Enthusiastic },
  ]);
  const [generationStep, setGenerationStep] = useState(0);
  const [currentDraft, setCurrentDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);

  const handleAddPlatform = () => {
    setPlatformConfigs([
      ...platformConfigs,
      { id: crypto.randomUUID(), platform: Platform.LinkedInPost, tone: Tone.Professional },
    ]);
  };

  const handleRemovePlatform = (id: string) => {
    setPlatformConfigs(platformConfigs.filter((p) => p.id !== id));
  };

  const handlePlatformChange = <T,>(id: string, field: keyof PlatformConfig, value: T) => {
    setPlatformConfigs(
      platformConfigs.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };
  
  const triggerGeneration = useCallback(async () => {
    if (generationStep >= platformConfigs.length) return;
    setIsLoading(true);
    setCurrentDraft('');
    const currentConfig = platformConfigs[generationStep];
    const content = await generateContent(coreMessage, currentConfig.platform, currentConfig.tone);
    setCurrentDraft(content);
    setIsLoading(false);
  }, [generationStep, platformConfigs, coreMessage]);

  useEffect(() => {
    if (appState === AppState.GENERATING) {
      triggerGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, generationStep]);
  
  const handleStartGeneration = () => {
    if (coreMessage.trim() && platformConfigs.length > 0) {
      setGenerationStep(0);
      setResults([]);
      setAppState(AppState.GENERATING);
    }
  };

  const handleRetry = () => {
    triggerGeneration();
  };

  const handleAcceptAndContinue = () => {
    const currentConfig = platformConfigs[generationStep];
    setResults([...results, { ...currentConfig, content: currentDraft }]);
    if (generationStep < platformConfigs.length - 1) {
      setGenerationStep(generationStep + 1);
    } else {
      setAppState(AppState.RESULTS);
    }
  };

  const handleStartOver = () => {
    setCoreMessage('');
    setPlatformConfigs([{ id: crypto.randomUUID(), platform: Platform.Tweet, tone: Tone.Enthusiastic }]);
    setResults([]);
    setAppState(AppState.CONFIG);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Conversational Content Generator
          </h1>
          <p className="text-slate-400 mt-2">
            Turn one core message into tailored posts for all your platforms.
          </p>
        </header>

        <main>
          {appState === AppState.CONFIG && (
            <ConfigurationScreen
              coreMessage={coreMessage}
              setCoreMessage={setCoreMessage}
              platformConfigs={platformConfigs}
              onPlatformChange={handlePlatformChange}
              onAddPlatform={handleAddPlatform}
              onRemovePlatform={handleRemovePlatform}
              onStartGeneration={handleStartGeneration}
            />
          )}

          {appState === AppState.GENERATING && (
            <GenerationScreen
              currentConfig={platformConfigs[generationStep]}
              step={generationStep + 1}
              totalSteps={platformConfigs.length}
              isLoading={isLoading}
              draft={currentDraft}
              onRetry={handleRetry}
              onAccept={handleAcceptAndContinue}
            />
          )}

          {appState === AppState.RESULTS && (
            <ResultsScreen results={results} onStartOver={handleStartOver} />
          )}
        </main>
      </div>
    </div>
  );
};


// --- Sub-Components ---

interface ConfigurationScreenProps {
  coreMessage: string;
  setCoreMessage: (value: string) => void;
  platformConfigs: PlatformConfig[];
  onPlatformChange: <T,>(id: string, field: keyof PlatformConfig, value: T) => void;
  onAddPlatform: () => void;
  onRemovePlatform: (id: string) => void;
  onStartGeneration: () => void;
}

const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({
  coreMessage, setCoreMessage, platformConfigs, onPlatformChange, onAddPlatform, onRemovePlatform, onStartGeneration
}) => (
  <div className="space-y-8 animate-fade-in">
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-300">1. Your Core Message</h2>
      <textarea
        className="w-full h-24 p-3 bg-slate-700 rounded-md border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
        placeholder='e.g., "We hit 10,000 sign-ups this week."'
        value={coreMessage}
        onChange={(e) => setCoreMessage(e.target.value)}
      />
    </div>
    
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-300">2. Target Platforms & Tones</h2>
      <div className="space-y-4">
        {platformConfigs.map((config, index) => (
          <div key={config.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-slate-700/50 rounded-md">
            <select
              value={config.platform}
              onChange={(e) => onPlatformChange(config.id, 'platform', e.target.value as Platform)}
              className="col-span-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
            >
              {PLATFORM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select
              value={config.tone}
              onChange={(e) => onPlatformChange(config.id, 'tone', e.target.value as Tone)}
              className="col-span-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
            >
              {TONE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="flex justify-end items-center">
              <button
                onClick={() => onRemovePlatform(config.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full disabled:opacity-50"
                disabled={platformConfigs.length <= 1}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onAddPlatform}
        className="mt-4 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        <PlusIcon /> Add another platform
      </button>
    </div>

    <div className="text-center">
      <button
        onClick={onStartGeneration}
        disabled={!coreMessage.trim() || platformConfigs.length === 0}
        className="flex items-center justify-center gap-3 w-full md:w-auto mx-auto bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        <SparklesIcon /> Generate Content
      </button>
    </div>
  </div>
);


interface GenerationScreenProps {
  currentConfig: PlatformConfig;
  step: number;
  totalSteps: number;
  isLoading: boolean;
  draft: string;
  onRetry: () => void;
  onAccept: () => void;
}

const GenerationScreen: React.FC<GenerationScreenProps> = ({ currentConfig, step, totalSteps, isLoading, draft, onRetry, onAccept }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg animate-fade-in">
        <div className="text-center mb-4">
            <p className="text-slate-400">Step {step} of {totalSteps}</p>
            <h2 className="text-2xl font-semibold">
                Generating <span className="text-cyan-300">{currentConfig.platform}</span> with a <span className="text-purple-300">{currentConfig.tone}</span> tone
            </h2>
        </div>
        <div className="relative min-h-[250px] bg-slate-700 rounded-md p-4 border border-slate-600">
            {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-700/80 rounded-md">
                    <div className="w-12 h-12 border-4 border-t-purple-400 border-slate-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-300">Generating...</p>
                </div>
            ) : (
                <textarea
                    readOnly
                    value={draft}
                    className="w-full h-full min-h-[250px] bg-transparent resize-none border-none focus:ring-0 text-slate-200"
                />
            )}
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
                onClick={onRetry}
                disabled={isLoading}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
                Retry
            </button>
            <button
                onClick={onAccept}
                disabled={isLoading || !draft}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
                {step === totalSteps ? 'Finish' : 'Accept & Continue'}
            </button>
        </div>
    </div>
);


interface ResultsScreenProps {
  results: GeneratedContent[];
  onStartOver: () => void;
}

const ResultCard: React.FC<{ result: GeneratedContent }> = ({ result }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(result.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-800 p-5 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="text-xl font-semibold text-cyan-300">{result.platform}</h3>
                    <p className="text-sm bg-slate-700 text-purple-300 px-2 py-0.5 rounded-full inline-block mt-1">{result.tone}</p>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <p className="text-slate-300 whitespace-pre-wrap">{result.content}</p>
        </div>
    );
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onStartOver }) => (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Your Generated Content</h2>
            <button
                onClick={onStartOver}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Start Over
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map(result => (
                <ResultCard key={result.id} result={result} />
            ))}
        </div>
    </div>
);


export default App;
