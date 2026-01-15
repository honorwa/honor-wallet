import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  async generateResponse(prompt: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
};

// Pas de paramètre symbols - récupère tous les prix
export async function fetchLivePrices(): Promise<Record<string, number>> {
  try {
    return {
      BTC: 43250.50,
      ETH: 2280.30,
      BNB: 315.20,
      SOL: 98.45,
      ADA: 0.52,
      XRP: 0.61,
      DOT: 7.32,
      DOGE: 0.089,
      MATIC: 0.85,
      LINK: 14.67,
    };
  } catch (error) {
    console.error("Error fetching live prices:", error);
    return {};
  }
}

// Juste query en paramètre, pas assets
export async function getFinancialAdvice(query: string): Promise<string> {
  try {
    if (!API_KEY) {
      return "Conseil générique : Diversifiez votre portefeuille et investissez uniquement ce que vous pouvez vous permettre de perdre.";
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `En tant que conseiller financier crypto, réponds à cette question : ${query}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting financial advice:", error);
    return "Désolé, je ne peux pas fournir de conseil pour le moment.";
  }
}

export async function analyzeMarketData(data: any): Promise<string> {
  try {
    if (!API_KEY) {
      return "Analyse : Le marché montre des tendances mixtes. Surveillez les niveaux de support clés.";
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyse ces données de marché crypto et fournis des insights : ${JSON.stringify(data)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing market data:", error);
    return "Analyse non disponible pour le moment.";
  }
}

export async function generateTicketResponse(ticket: any): Promise<string> {
  try {
    if (!API_KEY) {
      return "Merci pour votre message. Notre équipe vous répondra sous peu.";
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `En tant que support client, réponds à ce ticket : ${ticket.message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating ticket response:", error);
    return "Notre équipe examinera votre demande et vous répondra bientôt.";
  }
}

export { genAI };
