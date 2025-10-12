import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

/**
 * /api/stock-data
 * 取得股票歷史資料
 * Query 參數：
 *   - symbol: 股票代號 (必填)
 *   - from: 起始日期 (YYYY-MM-DD)
 *   - to: 結束日期 (YYYY-MM-DD)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // ✅ 驗證 symbol 是否存在
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    // ✅ 處理日期參數（若沒提供，預設抓近 30 天）
    const fromDate = from ? new Date(from) : subDays(new Date(), 30);
    const toDate = to ? new Date(to) : new Date();

    // ✅ Yahoo Finance 需要 timestamp（秒）
    const period1 = Math.floor(fromDate.getTime() / 1000);
    const period2 = Math.floor(toDate.getTime() / 1000);

    // ✅ 查詢參數設定
    const queryOptions = {
      period1,
      period2,
      interval: '1d' as const,
    };

    console.log('-----Fetching from Yahoo Finance:---------');
    console.log(`\n\n\nhttps://query2.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1d\n\n\n`);
    console.log('-----Fetching from Yahoo Finance:---------');

    // ✅ 呼叫 Yahoo Finance API
    const results = await yahooFinance.historical(symbol, queryOptions, {
      validateResult: false,
    });

    // ✅ 格式化輸出資料
    const formattedData = results.map((item:any) => ({
      date: item.date.toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('❌ Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * 工具函式：回傳往前幾天的日期
 */
function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}
