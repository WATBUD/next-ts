// stockUtils.ts
import { parseISO } from 'date-fns';

export type StockData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  [key: `ma${number}`]: number | undefined;
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
export const calculateMovingAverages = (data: StockData[], maDays: number[] = [5, 10, 20, 60, 180]): StockData[] => {
  return data.map((item, index, array) => {
    const maValues: Record<string, number | undefined> = {};
    
    maDays.forEach(days => {
      if (index + days <= array.length) {
        const subset = array.slice(index, index + days);
        const avg = subset.reduce((sum, d) => sum + d.close, 0) / days;
        maValues[`ma${days}`] = Number(avg.toFixed(2));
      }
    });

    return {
      ...item,
      ...maValues
    };
  });
};

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

export const getTaiexFuturesSettlementDays = (): { date: string; daysUntil: number }[] => {
  const today = new Date();
  const year = today.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 ~ 12 月
  const result: { date: string; daysUntil: number }[] = [];

  const getThirdWednesday = (year: number, month: number): Date => {
    const firstDay = new Date(year, month - 1, 1);
    const firstDayWeekday = firstDay.getDay(); // 0=Sun, 3=Wed
    const day = 1 + ((3 - firstDayWeekday + 7) % 7) + 14; // 第三個星期三
    return new Date(year, month - 1, day);
  };

  for (const month of months) {
    const thirdWednesday = getThirdWednesday(year, month);
    const diffTime = thirdWednesday.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    result.push({
      date: thirdWednesday.toISOString().split("T")[0],
      daysUntil,
    });
  }

  return result;
};
