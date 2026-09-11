import { stockAgent } from './agents/stock-agent';

async function runTest() {
  console.log('--- Testing Stock Agent Portfolio Tool ---');

  const response = await stockAgent.generate(
    'What are my current Robinhood stock holdings and total valuation?'
  );

  console.log('\nAgent Output:\n', response.text);
}

runTest().catch((err) => console.error('Error running test:', err));