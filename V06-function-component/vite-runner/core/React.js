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
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextWorkOfUnit;
}

let root = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;

  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    shouldYield = deadline.timeRemaining() < 1;
  }

  // 链表中的节点遍历处理完毕,统一提交
  if (!nextWorkOfUnit && root) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type !== "TEXT_ELEMENT"
    ? document.createElement(type)
    : document.createTextNode("");
}

function updateProps(dom, props) {
  Object.keys(props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = props[prop];
    }
  });
}

function initChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

// 一边建立树到链表的关系，一边生成真实的 dom,
// 而不是先一次性将树生成为链表，再将链表生成真实的 dom
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  // 不是函数式组件的时候，才需要创建真实 dom
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      // 1.创建 dom
      const dom = (fiber.dom = createDom(fiber.type));
      // 注释掉 将生成的真实dom，添加到父级容器里面
      // 改为 commitRoot 统一提交
      // fiber.parent.dom.append(dom);

      // 2.处理 props
      updateProps(dom, fiber.props);
    }
  }

  // 3.转换链表 设置好指针
  const children = isFunctionComponent ? [fiber.type()] : fiber.props.children;
  initChildren(fiber, children);

  // 4.返回下一个要执行的任务
  // 转变成链表的总体规则如下：优先找 child孩子节点，没有孩子节点就找 sibling兄弟节点，没有孩子节点和兄弟节点，就找uncle叔叔节点。
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

const React = {
  createTextNode,
  createElement,
  render,
};

export default React;
