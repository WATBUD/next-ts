'use client'; // 標記為 Client Component

import { useEffect, useState } from 'react';

export default function CSRPage() {
  const [data, setData] = useState('');

  useEffect(() => {
    // 定義 async 函數並調用
    const fetchData = async () => {
      setData('start, CSR!');
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const posts = await res.json();
        setData(posts); // 將資料設置為物件陣列
      } catch (error) {
        setData(`Error: ${error.message}`);
      }
    };

    setTimeout(fetchData, 3000);
  }, []);

  return (
    <div>
     <h1>CSR Page</h1>
      <h2>Welcome to the Client-Side Rendering Page</h2>
      <p>This page demonstrates data fetching on the client side using CSR (Client-Side Rendering).</p>
      <p>Below is the list of posts fetched from the API:</p>
      <div>
        {Array.isArray(data) ? (
          <ul>
            {data.map(post => (
              <li key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>{data}</p> // 顯示其他資料（如錯誤訊息）
        )}
      </div>
    </div>
  );
}
