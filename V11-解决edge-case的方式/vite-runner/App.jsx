import React from "./core/React.js";

let showBar = false;
function Counter() {
  const bar = <div>bar</div>;

  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      Counter
      <button onClick={handleShowBar}>showBar</button>
      {showBar && bar}
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
