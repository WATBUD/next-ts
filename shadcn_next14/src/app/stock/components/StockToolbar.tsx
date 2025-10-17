'use client';

import { Button } from "@/components/ui/button";
import { LayoutDashboard, ChevronDown } from "lucide-react";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { name: 'Stock Dashboard', path: '/stock' },
  { name: 'Market Important Date', path: '/stock/market-Important-date' },
  // Add more menu items here as needed
];

export function StockToolbar({ currentPath }: { currentPath: string }) {
  const currentPage = menuItems.find(item => item.path === currentPath) || menuItems[0];

  return (
    <div className="flex justify-between items-center mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>{currentPage.name}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <DropdownMenuItem className="cursor-pointer">
                {item.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
