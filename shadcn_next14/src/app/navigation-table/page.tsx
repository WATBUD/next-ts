import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const links = [
  { href: '/Test1', text: 'Test1' },
  { href: '/stockDashboard', text: 'stockDashboard' },
  { href: '/payments', text: 'payments' },
  { href: '/resume/index', text: 'personalResume' },
  { href: '/language_practice', text: 'language_practice' },
  { href: '/language-practice-redux', text: 'language-practice-redux' }
];

export default function NavigationTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Link href={link.href}>{link.text}</Link>
            </TableCell>
            <TableCell>
              <Link href={link.href}>{link.href}</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 