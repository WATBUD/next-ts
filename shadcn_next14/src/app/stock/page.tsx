'use client';

import React, { useState } from 'react';
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
import { DatePicker } from "@/components/ui/date-picker";
import { Search } from "lucide-react";
import { subDays } from 'date-fns';
import { useStockData } from './useStockData';
import { StockData } from './stockUtils';
import { StockToolbar } from '@/app/stock/components/StockToolbar';
import { usePathname } from 'next/navigation';

const DEFAULT_SYMBOL = '2330.TW';
const DEFAULT_DAYS = 30;

export default function StockDashboard() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), DEFAULT_DAYS));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: stockData, loading, error } = useStockData(symbol, startDate, endDate);

  const handleStartDateChange = (date: Date | null) => {
    if (date) setStartDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) setEndDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));
  };

  const pathname = usePathname();

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Stock Dashboard</h1>
        <StockToolbar currentPath={pathname} />
        
        <form className="mb-8" onSubmit={e => e.preventDefault()}>
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

            <div>
              <Label className="block mb-2">Start Date</Label>
              <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
                maxDate={new Date()}
                className="w-full"
              />
            </div>
            <div>
              <Label className="block mb-2">End Date</Label>
              <DatePicker
                value={endDate}
                onChange={handleEndDateChange}
                minDate={startDate}
                maxDate={new Date()}
                className="w-full"
              />
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
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
                {stockData.map((data: StockData, idx: number) => (
                  <TableRow key={idx} className="hover:bg-gray-50">
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
              {loading ? 'Loading stock data...' : 'No stock data available.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
