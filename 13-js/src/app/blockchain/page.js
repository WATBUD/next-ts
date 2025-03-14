"use client";
import React, { useState, useEffect, useCallback } from "react";

const Progress = () => {
  const [message, setMessage] = useState(null);
  const [socket, setSocket] = useState(null); 
  const [lastProcessed, setLastProcessed] = useState(0);
  const wsSocket1= () => {
    const _socket1 = new WebSocket("wss://ws.btse.com/ws/futures");
    const futures_data=[];

    _socket1.onopen = () => {
      console.log("tradeHistoryApi connection established");
      _socket1.send(
        JSON.stringify({
          op: "subscribe",
          args: ["tradeHistoryApi:BTCPFC"],
        })
      );
    };
    _socket1.onmessage = (event) => {
      if (futures_data.length<3) {
        const data = JSON.parse(event.data);
        futures_data.push(data);
        setMessage(data);
        if(futures_data.length>=1){
            console.log(
                "%c blockchain+_socket1.onmessage",
                "color:#BB3DFF;font-family:system-ui;font-size:2rem;font-weight:bold",
                "futures_data:",
                futures_data
              );
        }
      }
      else{
      }


    };
    _socket1.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return _socket1;
  }
  const wsSocket2= () => {
    const oss_data=[];
    //const throttleInterval = 5000; // Set throttle interval in milliseconds (e.g., 2 seconds)

    const _socket1 = new WebSocket("wss://ws.btse.com/ws/oss/futures");
    _socket1.onopen = () => {
      console.log("WebSocket connection established");
      _socket1.send(
        JSON.stringify({
          op: "subscribe",
          args: ["update:BTCPFC_0"],
        })
      );
    };
    _socket1.onmessage = (event) => {
      //const currentTime = Date.now();
      if (oss_data.length<10) {
        const resData = JSON.parse(event.data);
        oss_data.push(resData);
        setMessage(resData);
        if(resData?.topic=="update:BTCPFC_0"){
            console.log(
                "%c update:BTCPFC_0+resData.asks",
                "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
                "resData.asks",
                resData.data.asks,
                Object.entries(resData.data.asks)
              );
        }
        if(oss_data.length==10){
            console.log(
                "%c blockchain",
                "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
                "oss_data:",
                oss_data,
                // "oss_data[0].asks",
                // oss_data[0].asks,
                // Object.entries(oss_data[0].asks)
              );
        }
      }
      else{
      }

    };
    _socket1.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return _socket1;
  }
  // Handle WebSocket connection and cleanup
  useEffect(() => {
    const _wsSocket1 = wsSocket1();
    const _wsSocket2 = wsSocket2();
    return () => {
        _wsSocket1.close();
        _wsSocket2.close();
      console.log("WebSocket connection closed");
    };



  }, []); // Empty dependency array to run only once when the component mounts

 


  return (
    <div>
      <h1>WebSocket Progress</h1>
      <div>
        {message ? (
          <pre>{JSON.stringify(message, null, 2)}</pre>
        ) : (
          <p>Waiting for data...</p>
        )}
      </div>
    </div>
  );
};

export default Progress;

