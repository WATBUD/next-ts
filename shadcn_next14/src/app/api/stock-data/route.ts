import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    // Convert dates to Date objects
    const fromDate = from ? new Date(from) : subDays(new Date(), 30);
    const toDate = to ? new Date(to) : new Date();
    
    // Format dates as YYYY-MM-DD for yahoo-finance2
    const formatForYahoo = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // Fetch historical data using yahoo-finance2
    const queryOptions = { 
      period1: formatForYahoo(fromDate),
      period2: formatForYahoo(toDate),
      interval: '1d' as const,
    };
    
    const results = await yahooFinance.historical(symbol, queryOptions);
    
    // Format the response
    const formattedData = results.map(item => ({
      date: item.date.toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

// Helper functions
function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function format(date: Date, formatStr: string): string {
  return date.toISOString().split('T')[0]; // Simple format for YYYY-MM-DD
}
