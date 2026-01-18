
import React from 'react';
import type { DiscountEntry } from '../types';
import { exportToExcel } from '../utils/exportUtils';

interface ResultsTableProps {
  data: DiscountEntry[];
  fileName: string;
  onReset: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, fileName, onReset }) => {
  const handleExport = () => {
    const dataToExport = data.map(item => ({
        'Data': item.data,
        'Rubrica': item.rubrica,
        'Valor (R$)': item.valor.toFixed(2).replace('.', ',')
    }));
    exportToExcel(dataToExport, `analise_${fileName.replace(/\.pdf$/i, '')}.xlsx`);
  };
  
  const totalValue = data.reduce((sum, item) => sum + item.valor, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-200 mb-4 sm:mb-0">Resultados da Análise</h2>
        <div className="flex space-x-2">
            <button
                onClick={onReset}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors duration-300"
            >
                Analisar Outro
            </button>
            {data.length > 0 && (
                <button
                onClick={handleExport}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar para Excel
                </button>
            )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-700/50 rounded-lg">
          <p className="text-slate-300 text-lg">Nenhum dos descontos procurados foi encontrado no extrato.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900/50 rounded-lg">
          <table className="min-w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-orange-400 uppercase bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Rubrica (Descrição)</th>
                <th scope="col" className="px-6 py-3 text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{item.data}</td>
                  <td className="px-6 py-4">{item.rubrica}</td>
                  <td className="px-6 py-4 text-right font-medium text-red-400 whitespace-nowrap">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-slate-200 bg-slate-700">
                  <td colSpan={2} className="px-6 py-3 text-right text-base">Total Descontado:</td>
                  <td className="px-6 py-3 text-right text-base text-red-300">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                  </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
