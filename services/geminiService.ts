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

export async function fetchLivePrices(): Promise<Record<string, number>> {
  try {
    const cryptoIds = 'bitcoin,ethereum,binancecoin,solana,cardano,ripple,polkadot,dogecoin,matic-network,chainlink,tether,usd-coin,shiba-inu,avalanche-2,tron,litecoin,bitcoin-cash,near,uniswap,monero';
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const prices: Record<string, number> = {
      BTC: data.bitcoin?.usd || 43250.50,
      ETH: data.ethereum?.usd || 2280.30,
      BNB: data.binancecoin?.usd || 315.20,
      SOL: data.solana?.usd || 98.45,
      ADA: data.cardano?.usd || 0.52,
      XRP: data.ripple?.usd || 0.61,
      DOT: data.polkadot?.usd || 7.32,
      DOGE: data.dogecoin?.usd || 0.089,
      MATIC: data['matic-network']?.usd || 0.85,
      LINK: data.chainlink?.usd || 14.67,
      USDT: data.tether?.usd || 1.00,
      USDC: data['usd-coin']?.usd || 1.00,
      SHIB: data['shiba-inu']?.usd || 0.00002,
      AVAX: data['avalanche-2']?.usd || 35.20,
      TRX: data.tron?.usd || 0.11,
      LTC: data.litecoin?.usd || 85.50,
      BCH: data['bitcoin-cash']?.usd || 450.00,
      NEAR: data.near?.usd || 6.80,
      UNI: data.uniswap?.usd || 7.50,
      XMR: data.monero?.usd || 120.00,
    };

    return prices;
  } catch (error) {
    console.error("Error fetching live prices:", error);
    return {
      BTC: 43250.50, ETH: 2280.30, BNB: 315.20, SOL: 98.45,
      ADA: 0.52, XRP: 0.61, DOT: 7.32, DOGE: 0.089,
      MATIC: 0.85, LINK: 14.67, USDT: 1.00, USDC: 1.00,
      SHIB: 0.00002, AVAX: 35.20, TRX: 0.11, LTC: 85.50,
      BCH: 450.00, NEAR: 6.80, UNI: 7.50, XMR: 120.00,
    };
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
