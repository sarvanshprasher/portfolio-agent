import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const stockQuoteTool = createTool({
  id: 'get-stock-quote',
  description: 'Fetches real-time price, day high/low, and 24h percentage change for a ticker symbol.',
  inputSchema: z.object({
    symbol: z.string().describe('Stock ticker symbol, e.g. AAPL, NVDA, TSLA'),
  }),
  outputSchema: z.object({
    symbol: z.string(),
    price: z.number(),
    changePercent: z.number(),
    high: z.number(),
    low: z.number(),
  }),
  execute: async ({ symbol }) => {
    symbol = symbol.toUpperCase();
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`
      );
      const data = await response.json();
      const meta = data.chart.result[0].meta;

      const price = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose;
      const changePercent = ((price - previousClose) / previousClose) * 100;

      return {
        symbol,
        price,
        changePercent: parseFloat(changePercent.toFixed(2)),
        high: meta.regularMarketDayHigh,
        low: meta.regularMarketDayLow,
      };
    } catch (error) {
      throw new Error(`Failed to fetch stock data for ${symbol}`);
    }
  },
});