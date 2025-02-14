"use client";
import { useState } from 'react';

export default function Home() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [primeNumbers, setPrimeNumbers] = useState<number[]>([]);

  // 判斷是否為質數的函數
  function isPrime(num: number): boolean {
    if (num < 2) {
      return false;
    }
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  }

  // 找出指定範圍內的所有質數
  function findPrimes(start: number, end: number): number[] {
    let primes: number[] = [];
    for (let i = start; i <= end; i++) {
      if (isPrime(i)) {
        primes.push(i);
      }
    }
    return primes;
  }

  // 處理表單提交
  const handleSubmit = () => {
    const startNum = parseInt(start, 10);
    const endNum = parseInt(end, 10);
    const primes = findPrimes(startNum, endNum);
    setPrimeNumbers(primes);
  };

  return (
    <div>
      <h1>質數篩選器</h1>
      <div>
        <label>
          Enter start:
          <input
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Enter end:
          <input
            type="text"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSubmit}>查找質數</button>
      <div>
        <p>找到 {primeNumbers.length} 個質數</p>
        <p>{primeNumbers.join(' ')}</p>
      </div>
    </div>
  );
}
