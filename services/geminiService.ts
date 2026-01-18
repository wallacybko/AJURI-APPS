
import { GoogleGenAI, Type } from "@google/genai";
import { DISCOUNT_TYPES } from '../constants';
import type { DiscountEntry } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      data: {
        type: Type.STRING,
        description: 'A data da transação no formato DD/MM/AAAA.',
      },
      rubrica: {
        type: Type.STRING,
        description: 'A descrição exata da transação como aparece no extrato.',
      },
      valor: {
        type: Type.NUMBER,
        description: 'O valor numérico do débito, como um número negativo. Ex: -59.90',
      },
    },
    required: ['data', 'rubrica', 'valor'],
  },
};

const buildPrompt = (): string => {
  return `
    Você é um assistente de IA especialista em análise financeira, focado em extratos bancários brasileiros, chamado LitiScan. Sua tarefa é analisar o extrato em PDF fornecido e extrair TODAS as transações de débito que correspondam a qualquer uma das seguintes rubricas:

    Lista de Rubricas a Procurar:
    ${DISCOUNT_TYPES.join('\n')}

    Instruções:
    1.  Analise o documento inteiro. As transações de débito podem estar em uma coluna "Débito", "Saídas" ou marcadas com um sinal de negativo (-) ou "D".
    2.  Para cada transação de débito encontrada, verifique se a descrição dela ('Histórico', 'Descrição', etc.) corresponde a um dos itens da lista acima.
    3.  Para CADA correspondência, extraia as seguintes informações:
        - **data**: A data completa da transação (ex: "DD/MM/AAAA").
        - **rubrica**: A descrição exata da transação, conforme consta no extrato.
        - **valor**: O valor numérico do débito. DEVE ser um número negativo. Por exemplo, se o extrato mostrar "59,90 D" ou "-59,90", o valor a ser extraído é -59.90. Use ponto como separador decimal.
    4.  Retorne os resultados como um array JSON de objetos, seguindo o schema definido.
    5.  Se NENHUMA transação correspondente for encontrada no extrato, retorne um array vazio: []. Não inclua texto explicativo, apenas o array JSON.
  `;
};

export const analyzeStatement = async (pdfBase64: string): Promise<DiscountEntry[]> => {
  const prompt = buildPrompt();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
          parts: [
              { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
              { text: prompt },
          ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.warn("Gemini returned an empty response.");
        return [];
    }
    
    const parsedJson = JSON.parse(jsonText);
    
    // Sort results by date
    if(Array.isArray(parsedJson)) {
        return parsedJson.sort((a, b) => {
            const dateA = a.data.split('/').reverse().join('-');
            const dateB = b.data.split('/').reverse().join('-');
            return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
    }

    return [];

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    throw new Error("Failed to analyze bank statement.");
  }
};
