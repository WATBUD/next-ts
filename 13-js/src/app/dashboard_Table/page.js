"use client";

import TablesDisplay from '@/app/components/TablesDisplay'; 


import React, { useEffect } from 'react';



const columns = ['Name', 'Email', 'Role']; // 列标题数组
const data = [
  ['John Doe', 'john@example.com', 'Admin'],
  ['John Doe', 'john@example.com', 'Admin'],
  ['John Doe', 'john@example.com', 'Admin'],
  ['John Doe', 'john@example.com', 'Admin'],

]; 

const dashboard_Table = () => {
  useEffect(() => {
    
    console.log(
      "%c +dashboard_Table",
      "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
    );
    return () => {
      
    }
  }, []);
  return (
    <div>
      {/* 其他内容 */}
      <TablesDisplay columns={columns} data={data} />
    </div>
  );
};
export default dashboard_Table;