// app/page.js
import React from 'react';

async function fetchData() {
  // 模擬從外部 API 獲取大量資料，並故意延遲 5 秒
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        resolve(await res.json());
      } catch (error) {
        reject(error);
      }
    }, 5000); // 5秒後執行
  });
}



export default async function Page() {
  const startTime = performance.now(); // 開始計時
  const posts = await fetchData();
  const endTime = performance.now(); // 結束計時

  // 計算 SSR 渲染時間
  const ssrTime = endTime - startTime;

  return (
    <div>
      <h1>Next.js App Router SSR 範例</h1>
      <p>SSR 渲染時間: {ssrTime.toFixed(2)} 毫秒</p>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}