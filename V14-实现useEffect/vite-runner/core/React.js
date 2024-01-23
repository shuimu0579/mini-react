function createTextNode(nodeValue) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        console.log("child", child);
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };
  nextWorkOfUnit = wipRoot;
}

let wipRoot = null;
let currentRoot = null;
let nextWorkOfUnit = null;
let deletions = [];
let wipFiber = null;
function workLoop(deadline) {
  let shouldYield = false;

  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    console.log("wipRoot", wipRoot);
    console.log("nextWorkOfUnit", nextWorkOfUnit);
    // 找到需要更新的子树的结束：遍历完整颗子树 -》当处理兄弟节点的时候
    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      console.log("hit", wipRoot, nextWorkOfUnit);
      nextWorkOfUnit = undefined;
    }

    shouldYield = deadline.timeRemaining() < 1;
  }

  // 链表中的节点遍历处理完毕,统一提交
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  deletions.forEach(commitDeletion);
  commitWork(wipRoot.child);
  commitEffectHook();
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitEffectHook() {
  function run(fiber) {
    if (!fiber) return;
    fiber.effectHook?.callback();
    run(fiber.child);
    run(fiber.sibling);
  }

  run(wipRoot);
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type !== "TEXT_ELEMENT"
    ? document.createElement(type)
    : document.createTextNode("");
}

function updateProps(dom, nextProps, prevProps) {
  // Object.keys(nextProps).forEach((prop) => {
  //   if (prop !== "children") {
  //     if (prop.startsWith("on")) {
  //       const eventType = prop.slice(2).toLowerCase();
  //       dom.addEventListener(eventType, nextProps[prop]);
  //     } else {
  //       dom[prop] = nextProps[prop];
  //     }
  //   }
  // });

  // {id: "1"} {}
  // 1、old 有 new 没有 删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  // 2、new 有 old没有 添加
  // 3、new 有 old有 修改
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();

          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          console.log("nextProps", nextProps);
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  let prevChild = null;
  console.log("fiber", fiber);
  let oldFiber = fiber.alternate?.child;
  console.log("oldFiber", oldFiber);

  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;

    let newFiber;
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,

        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber, // 新链表节点到老链表节点的alternate指针
      };
    } else {
      if (child) {
        // create
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,

          dom: null,
          effectTag: "placement",
        };
      }

      if (oldFiber) {
        console.log("oldFiber", oldFiber);
        deletions.push(oldFiber);
      }
    }

    // 当children里面有几个子项的时候，当前oldFiber是需要更新的，需要指向oldFiber.sibling
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }

    if (newFiber) {
      prevChild = newFiber;
    }
  });

  console.log(oldFiber);
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = [];
  stateHookIndex = 0;
  wipFiber = fiber;

  // 转换链表 设置好指针
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1.创建 dom
    const dom = (fiber.dom = createDom(fiber.type));
    // 注释掉 将生成的真实dom，添加到父级容器里面
    // 改为 commitRoot 统一提交
    // fiber.parent.dom.append(dom);

    // 2.处理 props
    updateProps(dom, fiber.props, {});
  }

  // 3.转换链表 设置好指针
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

// 一边建立树到链表的关系，一边生成真实的 dom,
// 而不是先一次性将树生成为链表，再将链表生成真实的 dom
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  // 不是函数式组件的时候，才需要创建真实 dom
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 4.返回下一个要执行的任务
  // 转变成链表的总体规则如下：优先找 child孩子节点，没有孩子节点就找 sibling兄弟节点，没有孩子节点和兄弟节点，就找uncle叔叔节点。
  if (fiber.child) {
    return fiber.child;
  }

  // 找到非函数组件的兄弟节点，找到函数组件的兄弟节点
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(workLoop);

function update() {
  console.log(wipFiber);
  let currentFiber = wipFiber;

  // `update`函数里面返回 `() => {console.log(currentFiber);}`函数
  // 使得 currentFiber 得到的就是 当前点击的要更新的组件
  return () => {
    console.log(currentFiber);

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    // wipRoot = {
    //   dom: currentRoot.dom,
    //   props: currentRoot.props,
    //   alternate: currentRoot, // 新链表节点到老链表节点的alternate指针
    // };

    nextWorkOfUnit = wipRoot;
  };
}

let stateHooks;
let stateHookIndex;
function useState(initial) {
  let currentFiber = wipFiber;
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];

  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  };

  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });
  stateHook.queue = [];

  stateHookIndex++;
  stateHooks.push(stateHook);

  currentFiber.stateHooks = stateHooks;

  function setState(action) {
    //提前检测传入的 state 值，减少不必要的更新
    const eagerState =
      typeof action === "function" ? action(stateHook.state) : action;
    if (eagerState === stateHook.state) return false;

    stateHook.queue.push(typeof action === "function" ? action : () => action);

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };

    nextWorkOfUnit = wipRoot;
  }

  return [stateHook.state, setState];
}

function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
  };

  wipFiber.effectHook = effectHook;
}

const React = {
  update,
  createTextNode,
  createElement,
  render,
  useState,
  useEffect,
};

export default React;
