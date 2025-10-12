// src/utils/stockUtils.ts

/**
 * 股票資料結構
 */
export type StockData = {
    date: string;   // API 回傳日期字串
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
  
  /**
   * 計算移動平均線
   * @param data - 股票資料陣列（時間順序排列，最新在上）
   * @returns 附帶 MA 值的新資料陣列
   */
  export const calculateMovingAverages = (data: StockData[]): StockData[] => {
    return data.map((item, index, array) => {
      /**
       * 計算特定天數的平均值（需有完整 N 天資料）
       */
      const calcMA = (days: number) => {
        if (index + days > array.length) return undefined; // 不足 N 天則不計算
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
  
  /**
   * 計算單一天期的移動平均
   * （例如僅要取 MA10，可直接呼叫）
   */
  export const calculateSingleMA = (data: StockData[], days: number): (number | undefined)[] => {
    return data.map((_, index, array) => {
      if (index + days > array.length) return undefined;
      const subset = array.slice(index, index + days);
      const avg = subset.reduce((sum, d) => sum + d.close, 0) / days;
      return Number(avg.toFixed(2));
    });
  };
  