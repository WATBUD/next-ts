// app/csr-page/page.js
'use client'; // 標記為 Client Component

import { useEffect, useState } from 'react';

export default function CSRPage() {
  const [data, setData] = useState('');

  useEffect(() => {
    // 模擬一個 API 請求
    setData('start, CSR!');
    setTimeout(() => {
      setData('Hello, CSR!');
    }, 3000);
  }, []);

  return (
    <div>
      <h1>CSR Page</h1>
      <p>Data fetched on the client: {data}</p>
    </div>
  );
}