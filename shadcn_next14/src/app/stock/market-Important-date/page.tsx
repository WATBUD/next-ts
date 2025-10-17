'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, AlertTriangle, CalendarDays } from 'lucide-react';
import { getQuadrupleWitchingDays, getTaiexFuturesSettlementDays } from '../stockUtils';
import { StockToolbar } from '@/app/stock/components/StockToolbar';
import { usePathname } from 'next/navigation';

type MarketEvent = {
  date: string;
  daysUntil: number;
  type: 'quadruple' | 'taifex';
  quarter?: string;
  month?: string;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EventTypeBadge = ({ type }: { type: 'quadruple' | 'taifex' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      type === 'quadruple' 
        ? 'bg-purple-100 text-purple-800' 
        : 'bg-blue-100 text-blue-800'
    }`}>
      {type === 'quadruple' ? 'Quadruple Witching' : 'TAIFEX Settlement'}
    </span>
  );
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

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function ImportantDatesDashboard() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  
  const events = useMemo(() => {
    const quadWitchings = getQuadrupleWitchingDays().map(event => ({
      ...event,
      type: 'quadruple' as const,
      quarter: `Q${Math.floor(new Date(event.date).getMonth() / 3) + 1}`
    }));

    const taifexSettlements = getTaiexFuturesSettlementDays().map(event => ({
      ...event,
      type: 'taifex' as const,
      month: MONTH_NAMES[new Date(event.date).getMonth()]
    }));

    return [...quadWitchings, ...taifexSettlements]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by newest first
      .filter(event => event.daysUntil >= 0 || event.daysUntil <= 0); // Show past 7 days
  }, []);

  const upcomingEvents = events.filter(event => event.daysUntil >= 0);
  const recentEvents = events.filter(event => event.daysUntil < 0);

  const renderEventRow = (event: MarketEvent) => {
    const { text, className } = getDaysUntilText(event.daysUntil);
    const bgColor = event.type === 'quadruple' 
      ? (event.daysUntil > 5 ? 'bg-purple-50' : 'bg-purple-100')
      : (event.daysUntil > 5 ? 'bg-blue-50' : 'bg-blue-100');

    return (
      <TableRow key={`${event.type}-${event.date}`} className="hover:bg-gray-50">
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            {formatDate(event.date)}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <EventTypeBadge type={event.type} />
            <span className="text-sm text-gray-700">
              {event.type === 'quadruple' 
                ? `${event.quarter} Quadruple Witching Day`
                : `${event.month} Futures Settlement`}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm ${className} ${bgColor}`}>
            {text}
          </span>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
                 <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Market Important Dates {currentYear}
          </h1>
  
          <StockToolbar currentPath={pathname} />
   
          <p className="text-lg text-gray-600 mb-8">
            Track key market events and settlement dates
          </p>

          <Card className="shadow-lg border-0 rounded-xl overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CalendarDays className="h-6 w-6" />
                Upcoming Market Events
              </CardTitle>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {upcomingEvents.length} Upcoming
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
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(renderEventRow)
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                      No upcoming events in the next 7 days
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {recentEvents.length > 0 && (
          <Card className="shadow-sm border-0 rounded-xl overflow-hidden mb-8">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg font-medium text-gray-900">
                Recent Events (Past 7 Days)
              </CardTitle>
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
                  {recentEvents.map(renderEventRow)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <AlertTriangle className="h-5 w-5" />
                Quadruple Witching
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2">
              <p>Occurs on the third Friday of March, June, September, and December when stock options, stock index futures, stock index options, and single stock futures all expire on the same day.</p>
              <p className="font-medium mt-2">Market Impact:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Increased trading volume and volatility</li>
                <li>Wider bid-ask spreads</li>
                <li>Potential for larger price swings</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calendar className="h-5 w-5" />
                TAIFEX Settlement
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2">
              <p>TAIFEX futures and options contracts settle on the third Wednesday of each month. This includes index futures, stock futures, and options contracts.</p>
              <p className="font-medium mt-2">Key Points:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Settles on the third Wednesday of each month</li>
                <li>Includes TAIEX and Mini-TAIEX futures/options</li>
                <li>May cause increased volume and volatility</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
    </div>
  );
}