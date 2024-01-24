import React from "./core/React.js";

// useEffect
// 调用时机是在 React 完成对 DOM 的渲染之后，并且浏览器完成绘制之前。

// cleanup 在调用 useEffect 之前进行调用，
// 当 deps 为空的时候不会调用返回的cleanup

function Foo() {
  console.log("re foo");
  // 为什么这些 Hook 不能在if语句里面/也只能在函数内部的顶层添加，
  // 都是为了在多个Hooks之间能够准确的获取到特定的Hook,并执行。
  // 因为调用Hook是根据多个 Hook组成的数组Hooks 的下标索引stateHookIndex来获取到特定 Hook的。
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");

  function handleClick() {
    // setCount 会触发 组件 Foo 的更新(或者叫做调用)
    // 从而再一次的调用 React.useState 函数, 获取到新的 count 值
    setCount((c) => c + 1);
    setBar(() => "bar");
  }

  React.useEffect(() => {
    console.log(
      "init  useEffect调用时机是在 React 完成对 DOM 的渲染之后，并且浏览器完成绘制之前"
    );
    return () => {
      console.log("cleanup 0");
    };
  }, []);

  React.useEffect(() => {
    console.log("update", count);
    // cleanup
    return () => {
      console.log("cleanup 1");
    };
  }, [count]);

  React.useEffect(() => {
    console.log("update", count);
    // cleanup
    return () => {
      console.log("cleanup 2");
    };
  }, [count]);

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
