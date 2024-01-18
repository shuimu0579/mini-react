import React from "./core/React.js";

let showBar = false;
function Counter() {
  // const foo = <div>foo</div>;
  function Foo() {
    return <div>foo</div>;
  }
  const bar = <p>bar</p>;

  function handleClick() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      Counter
      {/* <div>{showBar ? bar : foo}</div> */}
      <div>{showBar ? bar : <Foo></Foo>}</div>
      <button onClick={handleClick}>click</button>
    </div>
  );
}
function App() {
  return (
    <div id="app">
      app-mini-react
      <Counter></Counter>
    </div>
  );
}

export default App;
