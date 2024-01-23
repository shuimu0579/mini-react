import React from "./core/React.js";

function Foo() {
  // 为什么这些 Hook 不能在if语句里面/也只能在函数内部的顶层添加，
  // 都是为了在多个Hooks之间能够准确的获取到特定的Hook,并执行。
  // 因为调用Hook是根据多个 Hook组成的数组Hooks 的下标索引stateHookIndex来获取到特定 Hook的。
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");

  function handleClick() {
    // setCount 会触发 组件 Foo 的更新(或者叫做调用)
    // 从而再一次的调用 React.useState 函数, 获取到新的 count 值
    // setCount((c) => c + 1);
    // setBar((s) => s + "bar");

    setBar("bar");
  }

  return (
    <div>
      <h1>foo</h1>
      {count}
      <div>{bar}</div>
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
