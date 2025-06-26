"use client"
// import {
//   timeoutPromise
// } from "@/CustomUtilService"
import React, { useState, useEffect } from 'react';

import axios, { AxiosError } from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export default function Home() {
  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = `http://localhost:9421/dailyMarketTrading`;
        const response = await axios.get(apiUrl);


        console.log(
          "%c dailyMarketTrading",
          "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
          "response:",
          response
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          console.error(`发生异常：`, axiosError.message);
          return `发生异常：` + axiosError.message;
        } else {
          console.error(`发生未知异常：`, error);
          return `发生未知异常：` + error;
        }
      }
    }

    fetchData();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>

        
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>


        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>


    </main>
  );
}
