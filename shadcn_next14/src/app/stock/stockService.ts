export type StockData = {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
  
  /**
   * 取得股票資料
   */
  export async function fetchStockData(
    symbol: string,
    startDate: Date | string,
    endDate: Date | string
  ): Promise<StockData[]> {
    try {
      const formatDate = (date: Date | string, isEndDate = false) => {
        const d = new Date(date);
        if (isEndDate) d.setHours(23, 59, 59, 0);
        else if (!(typeof date === 'string' && date.includes('T'))) d.setHours(0, 0, 0, 0);
        return d.toISOString().split('.')[0]; // 去掉毫秒
      };
  
      const from = formatDate(startDate);
      const to = formatDate(endDate, true);
  
      const baseUrl = `${window.location.origin}/api/stock-data`;
      const queryString = `symbol=${encodeURIComponent(symbol)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const fullUrl = `${baseUrl}?${queryString}`;
  
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('Failed to fetch stock data');
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  }
  