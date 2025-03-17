"use client";
import React from "react";
import { eventEmitter } from "./eventEmitter";

const SenderComponent = () => {
  const sendMessage = () => {
    eventEmitter.emit("message", "Hello from SenderComponent!");
  };

  return (
    <button onClick={sendMessage}>Send Event</button>
  );
};

export default SenderComponent;
