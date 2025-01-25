"use client";
import React, { useState, useCallback } from 'react';

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});
const ChildNoMemo = ({ onClick }) => {
  console.log('ChildNoMemo rendered');
  return <button onClick={onClick}>Click me</button>;
};
export default function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // 使用 useCallback，確保引用穩定

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <Child onClick={handleClick} />
      <ChildNoMemo onClick={handleClick} />
    </div>
  );
}
