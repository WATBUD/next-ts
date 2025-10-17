'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { getQuadrupleWitchingDays } from '../stockUtils';

export default function ImportantDatesDashboard() {
  const [currentYear] = useState<number>(new Date().getFullYear());
  
  const importantDates = useMemo(() => {
    return getQuadrupleWitchingDays();
  }, [currentYear]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDaysUntilText = (days: number): { text: string, className: string } => {
    if (days > 5) {
      return { text: `${days} days left`, className: 'text-red-600 font-semibold' };
    } else if (days > 1) {
      return { text: `${days} days left`, className: 'text-amber-600' };
    } else if (days === 1) {
      return { text: 'Tomorrow!', className: 'text-green-600 font-bold' };
    } else if (days === 0) {
      return { text: 'Today!', className: 'text-green-600 font-bold' };
    } else {
      return { text: 'Passed', className: 'text-gray-500' };
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Stock Market Important Dates
          </h1>
          <p className="text-lg text-gray-600">
            Key market events and quadruple witching days for {currentYear}
          </p>
        </div>

        <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Quadruple Witching Days {currentYear}
              </CardTitle>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {importantDates.filter(d => d.daysUntil >= 0).length} Upcoming
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-1/3">Date</TableHead>
                  <TableHead className="w-1/3">Event</TableHead>
                  <TableHead className="w-1/3 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importantDates.map((event, index) => {
                  const { text, className } = getDaysUntilText(event.daysUntil);
                  const quarter = ['Q1', 'Q2', 'Q3', 'Q4'][index];
                  
                  return (
                    <TableRow 
                      key={event.date} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(event.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          {quarter} Quadruple Witching Day
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm ${className} ${event.daysUntil > 5 ? 'bg-red-50' : event.daysUntil >= 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                          {text}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Clock className="h-5 w-5" />
                What is Quadruple Witching?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Quadruple witching refers to the third Friday of March, June, September, and December when stock options, stock index futures, stock index options, and single stock futures all expire on the same day. This can lead to increased trading volume and market volatility.
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                Market Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              During quadruple witching days, traders typically close out their positions before expiration, which can lead to increased trading volume and price volatility. The market may experience wider bid-ask spreads and increased volatility in the final hour of trading.
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Calendar className="h-5 w-5" />
                Key Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              <ul className="space-y-2">
                <li>• Occurs on the third Friday of March, June, September, and December</li>
                <li>• Regular trading hours are 9:30 AM to 4:00 PM ET</li>
                <li>• Options typically stop trading at 4:00 PM ET on expiration day</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
