// stockUtils.ts
import { parseISO } from 'date-fns';

export type StockData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma5?: number;
  ma10?: number;
  ma20?: number;
  ma60?: number;
};

// 將 API 回傳資料轉成可用型態
export const formatStockData = (data: any[]): StockData[] =>
  data.map(item => ({
    ...item,
    date: parseISO(item.date).toISOString(),
    open: Number(item.open),
    high: Number(item.high),
    low: Number(item.low),
    close: Number(item.close),
    volume: Number(item.volume),
  }));

// 計算移動平均
export const calculateMovingAverages = (data: StockData[]): StockData[] => {
  return data.map((item, index, array) => {
    const calcMA = (days: number) => {
      if (index + days > array.length) return undefined;
      const subset = array.slice(index, index + days);
      const avg = subset.reduce((sum, d) => sum + d.close, 0) / days;
      return Number(avg.toFixed(2));
    };

    return {
      ...item,
      ma5: calcMA(5),
      ma10: calcMA(10),
      ma20: calcMA(20),
      ma60: calcMA(60),
    };
  });
};
