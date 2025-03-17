
"use client";
import React, { useState, useEffect } from "react";
import { eventEmitter } from "./eventEmitter";

const ReceiverComponent = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleMessage = (msg) => {
      setMessage(msg);
    };

    eventEmitter.on("message", handleMessage);

    return () => {
      eventEmitter.off("message", handleMessage); // 清理事件監聽
    };
  }, []);

  return <div>Received Message: {message}</div>;
};

export default ReceiverComponent;
