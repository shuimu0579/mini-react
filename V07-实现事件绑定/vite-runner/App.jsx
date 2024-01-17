import React from "./core/React.js";

function Counter({ num = 0 }) {
  function handleClick() {
    console.log("click");
  }
  return (
    <div>
      count: {num}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function CounterContainer() {
  return <Counter></Counter>;
}

function App() {
  return (
    <div id="app">
      app-mini-react
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
      <CounterContainer></CounterContainer>
    </div>
  );
}

console.log("App", App);

export default App;
