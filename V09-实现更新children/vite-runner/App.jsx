import React from "./core/React.js";

let count = 10;
let props = { id: "1111111111" };
function Counter({ num }) {
  function handleClick() {
    console.log("click");
    // props 更新
    count++;
    // props 删除
    props = {};
    React.update();
  }
  return (
    <div {...props}>
      count: {count}
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
