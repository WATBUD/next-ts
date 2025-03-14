
"use client";

import React, { useState, useEffect } from "react";

const ElevatorController = () => {
  const [currentFloor, setCurrentFloor] = useState(1); // 當前樓層
  const [targetFloors, setTargetFloors] = useState([]); // 目標樓層隊列
  const [isDoorOpen, setIsDoorOpen] = useState(false); // 門是否打開
  const [isMoving, setIsMoving] = useState(false); // 是否正在移動

  // 處理樓層按鈕點擊
  const handleFloorButtonClick = (floor) => {
    if (!targetFloors.includes(floor)) {
      setTargetFloors([...targetFloors, floor]);
    }
  };

  // 電梯移動邏輯
  useEffect(() => {
    if (targetFloors.length > 0) {
      const nextFloor = targetFloors[0];
      const direction = nextFloor > currentFloor ? 1 : -1;

      // 開始移動
      setIsMoving(true);

      const moveElevator = () => {
        setCurrentFloor((prevFloor) => prevFloor + direction);
      };

      const interval = setInterval(() => {
        if (currentFloor === nextFloor) {
          clearInterval(interval);
          setIsDoorOpen(true); // 到達目標樓層，開門
          setIsMoving(false); // 停止移動
          setTimeout(() => {
            setIsDoorOpen(false); // 3秒後關門
            setTargetFloors((prevFloors) => prevFloors.slice(1)); // 移除已完成樓層
          }, 3000); // 門打開3秒後關閉
        } else {
          moveElevator();
        }
      }, 1000); // 每秒移動一層

      return () => clearInterval(interval);
    }
  }, [currentFloor, targetFloors]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>電梯控制器</h1>
      <ElevatorDisplay
        currentFloor={currentFloor}
        isDoorOpen={isDoorOpen}
        isMoving={isMoving}
      />
      <FloorButtons
        targetFloors={targetFloors}
        onFloorButtonClick={handleFloorButtonClick}
      />
    </div>
  );
};

// 電梯狀態顯示組件
const ElevatorDisplay = ({ currentFloor, isDoorOpen, isMoving }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p>當前樓層: {currentFloor}</p>
      <p>門狀態: {isDoorOpen ? "打開" : "關閉"}</p>
      <p>電梯狀態: {isMoving ? "移動中 🚀" : "停止中 🛑"}</p>
    </div>
  );
};

// 樓層按鈕組件
const FloorButtons = ({ targetFloors, onFloorButtonClick }) => {
  const floors = [1, 2, 3, 4, 5];

  return (
    <div>
      {floors.map((floor) => (
        <button
          key={floor}
          onClick={() => onFloorButtonClick(floor)}
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: targetFloors.includes(floor) ? "red" : "gray",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {floor}
        </button>
      ))}
    </div>
  );
};

export default ElevatorController;