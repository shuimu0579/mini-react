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

function render(vnode, container) {
  nextWorkOfUnit = {};

  // console.log("vnode", vnode);
  // console.log("container", container);
  // const dom =
  //   vnode.type !== "TEXT_ELEMENT"
  //     ? document.createElement(vnode.type)
  //     : document.createTextNode("");

  // Object.keys(vnode.props).forEach((prop) => {
  //   if (prop !== "children") {
  //     dom[prop] = vnode.props[prop];
  //   }
  // });
  // container.append(dom);

  // const children = vnode.props.children;
  // children.forEach((child) => {
  //   render(child, dom);
  // });
}

let nextWorkOfUnit = null;
function workLoop(IdleDeadline) {
  let shouldYield = false;

  while (!shouldYield) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    shouldYield = IdleDeadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

function performWorkOfUnit(work) {
  // 1.创建 dom
  const dom = (work.dom =
    vnode.type !== "TEXT_ELEMENT"
      ? document.createElement(vnode.type)
      : document.createTextNode(""));
  // 2.处理 props
  Object.keys(vnode.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = vnode.props[prop];
    }
  });
  // 3.转换链表 设置好指针
  const children = work.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      work.child = newWork;
    } else {
      prevChild.sibling = newWork;
    }
    prevChild = newWork;
  });
  // 4.返回下一个要执行的任务
  console.log(work);
}

requestIdleCallback(workLoop);

const React = {
  createTextNode,
  createElement,
  render,
};

export default React;
