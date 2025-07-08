import React, { createContext, useState, useContext } from 'react';

// Default Together AI API key and model
const DEFAULT_API_KEY = "tgp_v1_TTFKOf1vRWscqq1ea9o1g55arFB0r82Q3YnmdUYJP4I";
const DEFAULT_MODEL = "google/gemma-3n-E4B-it";

interface AIConfig {
  apiKey: string;
  model: string;
  updateConfig: (apiKey: string, model: string) => void;
}

const AIContext = createContext<AIConfig>({
  apiKey: DEFAULT_API_KEY,
  model: DEFAULT_MODEL,
  updateConfig: () => {},
});

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [model, setModel] = useState(DEFAULT_MODEL);

  const updateConfig = (newApiKey: string, newModel: string) => {
    setApiKey(newApiKey);
    setModel(newModel);
  };

  return (
    <AIContext.Provider value={{ apiKey, model, updateConfig }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);