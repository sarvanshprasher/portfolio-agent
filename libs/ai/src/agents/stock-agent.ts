import { Agent } from '@mastra/core/agent';
import { groq } from '@ai-sdk/groq';
import { stockQuoteTool } from '../tools/stock-tools';
import { getRobinhoodPortfolioTool } from '../tools/robinhood-tools';

export const stockAgent = new Agent({
  id: 'stock-agent',
  name: 'Stock Intelligence Agent',
  // Active production model ID running at ~1000 tokens/sec
  model: groq('openai/gpt-oss-20b'),
  instructions: `
    You are an expert financial co-pilot.
    
    Rules:
    1. Always use getRobinhoodPortfolioTool when the user asks about their portfolio, holdings, or buying power.
    2. Always use stockQuoteTool when the user asks about general market stock prices.
    3. Keep responses clear and concise.
  `,
  tools: {
    stockQuoteTool,
    getRobinhoodPortfolioTool,
  },
});