"use client";
import React, { useState, useCallback } from "react";


const Progress = () => {
  // 使用 state 來控制重置進度條動畫
  const [resetKey, setResetKey] = useState(0); // 用於重置進度條動畫的 key

  // 當按下按鈕時，觸發進度條動畫
  const handleClick = (type) => {
    const element = document.querySelector(`#${type} .progress-bar`);
    element.style.animation = null; // 先清除動畫
    element.offsetHeight; // 強制觸發重排，這樣可以重新啟動動畫
    element.style.animation = "progress100 1000ms ease forwards"; // 設定新的動畫
  };

  // 防抖函數，讓連續的事件觸發後，只有最後一次能夠執行
  const debounce = (func, wait = 500) => {
    let timer;
    return () => {
      clearTimeout(timer); // 清除之前的計時器
      timer = setTimeout(func, wait); // 設定新的計時器
    };
  };

  // 限流函數，限制事件執行的頻率
  const throttle = (func, delay = 1000) => {
    let lastCall = 0;
    return () => {
      const currentTime = new Date().getTime();
      if (currentTime - lastCall < delay) {
        return; // 如果距離上次執行時間不足 delay，則不執行
      }
      lastCall = currentTime; // 更新最後執行時間
      func(); // 執行函數
    };
  };

  // 使用 useCallback 包裝防抖和限流的事件處理函數，避免每次重渲染時重新創建
  const debounceHandleClick = useCallback(debounce(() => handleClick("debounce")), []);
  const throttleHandleClick = useCallback(throttle(() => handleClick("throttle")), []);

  return (
    <div>
      <h1>防抖 (debounce) 和 限流 (throttle) 的區別</h1>
      {/* 重置按鈕，用於重置所有進度條動畫 */}
      <button
        id="reset"
        type="button"
        onClick={() => setResetKey(prevKey => prevKey + 1)} // 重置進度條動畫
      >
        重置
      </button>

      {/* 普通模式進度條 */}
      <section id="normal">
        <h2>
          <span>普通模式</span>
          <button type="button" onClick={() => handleClick("normal")}>
            點擊
          </button>
        </h2>
        <div className="progress">
          <div className="progress-bar" key={resetKey}></div>
        </div>
      </section>

      {/* 防抖模式進度條 */}
      <section id="debounce">
        <h2>
          <span>防抖模式</span>
          <button type="button" onClick={debounceHandleClick}>
            點擊
          </button>
        </h2>
        <div className="progress">
          <div className="progress-bar" key={resetKey}></div>
        </div>
      </section>

      {/* 限流模式進度條 */}
      <section id="throttle">
        <h2>
          <span>限流模式</span>
          <button type="button" onClick={throttleHandleClick}>
            點擊
          </button>
        </h2>
        <div className="progress">
          <div className="progress-bar" key={resetKey}></div>
        </div>
      </section>

      {/* 在此處寫 CSS 樣式 */}
      <style>
        {`
          .progress {
            position: relative;
            width: 20rem;
            height: 1rem;
            margin: 2rem 0;
          }

          .progress .progress-bar {
            width: 2%;
            height: 100%;
            background-color: #499999;
            border-radius: 999px;
          }

          .progress::after {
            position: absolute;
            content: "";
            border-radius: 999px;
            width: 100%;
            height: 100%;
            background-color: #eee;
            top: 0;
            z-index: -1;
          }

          @keyframes progress100 {
            0% { width: 2%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default Progress;

