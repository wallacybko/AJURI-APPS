
import React, { useState, useCallback } from 'react';
import { Logo } from './components/Logo';
import { FileUpload } from './components/FileUpload';
import { ResultsTable } from './components/ResultsTable';
import { Spinner } from './components/Spinner';
import { analyzeStatement } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { DiscountEntry } from './types';

const App: React.FC = () => {
  const [discountData, setDiscountData] = useState<DiscountEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Por favor, envie um arquivo PDF.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDiscountData(null);
    setFileName(file.name);

    try {
      const base64File = await fileToBase64(file);
      const results = await analyzeStatement(base64File);
      setDiscountData(results);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao analisar o extrato. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const resetState = () => {
    setDiscountData(null);
    setError(null);
    setIsLoading(false);
    setFileName(null);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left sm:justify-start mb-8">
          <Logo className="h-20 w-20" />
          <div className="sm:ml-4 mt-4 sm:mt-0">
            <h1 className="text-4xl font-bold text-slate-100">LitiScan</h1>
            <p className="text-orange-400 text-lg">Análise de Extratos e Contracheques</p>
          </div>
        </header>

        <main className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {!isLoading && !discountData && (
            <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <Spinner />
              <p className="text-xl font-semibold mt-4 text-slate-300">Analisando seu extrato...</p>
              <p className="text-slate-400 mt-2">{fileName}</p>
              <p className="text-sm text-slate-500 mt-2">Isso pode levar alguns instantes.</p>
            </div>
          )}

          {discountData && !isLoading && (
            <ResultsTable data={discountData} fileName={fileName || 'extrato'} onReset={resetState} />
          )}

        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} LitiScan. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
