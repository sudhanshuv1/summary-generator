'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SummaryContextProps {
  file: File | null;
  setFile: (file: File | null) => void;
  summaryLength: number;
  setSummaryLength: (length: number) => void;
  summary: string;
  setSummary: (summary: string) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
}

const SummaryContext = createContext<SummaryContextProps | undefined>(undefined);

export const SummaryProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [summaryLength, setSummaryLength] = useState<number>(100);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  return (
    <SummaryContext.Provider value={{ file, setFile, summaryLength, setSummaryLength, summary, setSummary, error, setError }}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }
  return context;
};