import React from "react";
import SenderComponent from "./SenderComponent";
import ReceiverComponent from "./ReceiverComponent";

const App = () => {
  return (
    <div>
      <h2>React EventEmitter Example</h2>
      <SenderComponent />
      <ReceiverComponent />
    </div>
  );
};

export default App;
