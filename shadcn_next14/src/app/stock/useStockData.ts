// useStockData.ts
import { useState, useEffect } from 'react';
import { fetchStockData } from './stockService';
import { StockData, formatStockData, calculateMovingAverages } from './stockUtils';

export const useStockData = (symbol: string, startDate: Date, endDate: Date, maDays: number[] = [5, 10, 20, 60, 180]) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol || !startDate || !endDate) return;

      setLoading(true);
      setError(null);

      try {
        const formatDate = (date: Date, isEnd = false) => {
          const d = new Date(date);
          if (isEnd) d.setDate(d.getDate() + 1);
          return d.toISOString().split('T')[0];
        };

        const rawData = await fetchStockData(
          symbol,
          formatDate(startDate),
          formatDate(endDate, true)
        );

        const formattedData = formatStockData(rawData)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .filter(item => item.volume > 0);

        setData(calculateMovingAverages(formattedData, maDays));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, startDate, endDate, maDays]);

  return { data, loading, error };
};
