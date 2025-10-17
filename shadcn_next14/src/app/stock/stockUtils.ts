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

// utils/quadrupleWitching.ts
export const getQuadrupleWitchingDays = (): { date: string; daysUntil: number }[] => {
  const today = new Date();
  const year = today.getFullYear();
  const months = [3, 6, 9, 12];
  const result: { date: string; daysUntil: number }[] = [];

  const getThirdFriday = (year: number, month: number): Date => {
    const firstDay = new Date(year, month - 1, 1);
    const firstDayWeekday = firstDay.getDay(); // 0=Sun, 5=Fri
    const day = 1 + ((5 - firstDayWeekday + 7) % 7) + 14;
    return new Date(year, month - 1, day);
  };

  for (const month of months) {
    const thirdFriday = getThirdFriday(year, month);
    const diffTime = thirdFriday.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    result.push({
      date: thirdFriday.toISOString().split("T")[0],
      daysUntil,
    });
  }

  return result;
};
