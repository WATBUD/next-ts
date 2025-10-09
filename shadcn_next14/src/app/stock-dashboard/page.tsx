'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Search } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import yahooFinance from 'yahoo-finance2';
import { nodeServerPages } from 'next/dist/build/webpack/plugins/pages-manifest-plugin';

type StockData = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma5?: number;
  ma20?: number;
  ma60?: number;
};

const DEFAULT_SYMBOL = '2330.TW';
const DEFAULT_DAYS = 30;

async function fetchStockData(symbol: string, startDate: Date | string, endDate: Date | string) {
  try {
    // Function to format date as YYYY-MM-DDTHH:mm:ss, preserving original time components when possible
    const formatDate = (date: Date | string, isEndDate = false) => {
      // 永遠轉成 Date 物件
      const d = new Date(date);
    
      // 取出各時間組件
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
    
      if (isEndDate) {
        // 若是結束日期，統一補到當天的 23:59:59
        return `${year}-${month}-${day}T23:59:59`;
      }
    
      // 若是開始日期，若沒時間就預設 00:00:00
      const hasTime = typeof date === 'string' && date.includes('T');
      if (!hasTime) {
        return `${year}-${month}-${day}T00:00:00`;
      }
    
      // 否則保留原始時間
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };
    
    const from = formatDate(startDate);
    const to = formatDate(endDate, true);
    
    console.log('Formatted from:', from);
    console.log('Formatted to:', to);
    
    // Manually construct the URL to ensure time component is preserved
    const baseUrl = `${window.location.origin}/api/stock-data`;
    const queryString = `symbol=${encodeURIComponent(symbol)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const fullUrl = `${baseUrl}?${queryString}`;
    
 
    console.log('API Request URL:', fullUrl);
    
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

export default function StockDashboard() {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Initialize with null instead of undefined for better type safety with the DatePicker
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), DEFAULT_DAYS));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  type StockData = {
    date: string;  // Keep as string to match API response
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
  
  const calculateMovingAverages = (data: StockData[]): StockData[] => {
    return data.map((item, index, array) => {
      const calcMA = (days: number) => {
        // 嚴格要求前 N 天資料完整
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
  
  
  
  
  
  
  
  // Fetch stock data when symbol or date range changes
  useEffect(() => {
    const fetchData = async () => {
      // Add null checks since TypeScript can't infer that startDate and endDate are not null
      if (!symbol || !startDate || !endDate) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Format dates to YYYY-MM-DD to avoid timezone issues
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);
        
        const data = await fetchStockData(
          symbol, 
          startDateStr,
          endDateStr
        );
        
        // Convert date strings to Date objects
        const formattedData = data.map((item: any) => ({
          ...item,
          date: parseISO(item.date),
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
          volume: Number(item.volume)
        }));
        
        // Sort by date (newest first)
        const sortedData = [...formattedData].sort((a, b) => 
          b.date.getTime() - a.date.getTime()
        );
        
        // Filter out non-trading days (volume = 0)
        const filteredData = sortedData.filter((item: StockData) => item.volume > 0);
        
        console.log(`Original data: ${sortedData.length} points, Filtered data: ${filteredData.length} points`);
        console.log('sortedData:', sortedData);

        // Calculate moving averages
        const dataWithMA = calculateMovingAverages(filteredData);
        setStockData(dataWithMA);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch stock data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [symbol, startDate, endDate]);

  // Helper functions to handle date changes with proper timezone handling
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      // Create a new date from the selected date's local time components
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
      );
      
      // Store the date as is, without timezone adjustments
      setStartDate(localDate);
    } else {
      setStartDate(new Date());
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()+1,
        23, 59, 59, 999
      );
      // const nextDay = new Date(date);
      // nextDay.setDate(date.getDate()+);


      // Store the date as is, without timezone adjustments
      setEndDate(localDate);
    } else {
      setEndDate(new Date());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The form submission is handled by the useEffect hook
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Stock Dashboard</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="symbol" className="block mb-2">Stock Symbol</Label>
              <div className="flex gap-2">
                <Input
                  id="symbol"
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL, 2330.TW"
                  className="w-full"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Loading...' : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="w-full">
              <Label className="block mb-2">Start Date</Label>
              <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
                placeholder="Start date"
                maxDate={new Date()}
                className="w-full"
                isStartDate={true}
              />
            </div>
            <div className="w-full">
              <Label className="block mb-2">End Date</Label>
              <DatePicker
                value={endDate}
                onChange={handleEndDateChange}
                placeholder="End date"
                maxDate={new Date()}
                minDate={startDate || undefined}
                className="w-full"
                isEndDate={true}
              />
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {stockData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Open</TableHead>
                  <TableHead>High</TableHead>
                  <TableHead>Low</TableHead>
                  <TableHead>Close</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>MA5</TableHead>
                  <TableHead>MA20</TableHead>
                  <TableHead>MA60</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockData.map((data, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>{new Date(data.date).toLocaleDateString()}</TableCell>
                    <TableCell>{data.open.toFixed(2)}</TableCell>
                    <TableCell>{data.high.toFixed(2)}</TableCell>
                    <TableCell>{data.low.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">{data.close.toFixed(2)}</TableCell>
                    <TableCell>{data.volume.toLocaleString()}</TableCell>
                    <TableCell>{data.ma5?.toFixed(2) || '-'}</TableCell>
                    <TableCell>{data.ma20?.toFixed(2) || '-'}</TableCell>
                    <TableCell>{data.ma60?.toFixed(2) || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {loading ? 'Loading stock data...' : 'Generating demo stock data...'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}