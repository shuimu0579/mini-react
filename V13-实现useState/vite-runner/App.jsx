import React from "./core/React.js";

function Foo() {
  const [count, setCount] = React.useState(10);
  function handleClick() {
    // setCount 会触发 组件 Foo 的更新(或者叫做调用)
    // 从而再一次的调用 React.useState 函数, 获取到新的 count 值
    setCount((c) => c + 1);
  }

  return (
    <div>
      <h1>foo</h1>
      {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function App() {
  return (
    <div>
      app-mini-react:
      <Foo></Foo>
    </div>
  );
}

export default App;
