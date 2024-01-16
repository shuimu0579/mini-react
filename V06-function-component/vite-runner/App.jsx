import React from "./core/React.js";

function Counter() {
  return <div>count</div>;
}

function CounterContainer() {
  return <Counter></Counter>;
}

function App() {
  return (
    <div id="app">
      app-mini-react
      {/* <Counter></Counter> */}
      <CounterContainer></CounterContainer>
    </div>
  );
}

console.log("App", App);

export default App;
