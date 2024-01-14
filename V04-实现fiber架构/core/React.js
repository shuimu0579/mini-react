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

  // console.log("el", el);
  // console.log("container", container);
  // const dom =
  //   el.type !== "TEXT_ELEMENT"
  //     ? document.createElement(el.type)
  //     : document.createTextNode("");

  // Object.keys(el.props).forEach((prop) => {
  //   if (prop !== "children") {
  //     dom[prop] = el.props[prop];
  //   }
  // });
  // container.append(dom);

  // const children = el.props.children;
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
  if (!work.dom) {
    // 1.创建 dom
    const dom = (work.dom =
      work.type !== "TEXT_ELEMENT"
        ? document.createElement(work.type)
        : document.createTextNode(""));

    // 将生成的真实dom，添加到父级容器里面
    work.parent.dom.append(dom);

    // 2.处理 props
    Object.keys(work.props).forEach((prop) => {
      if (prop !== "children") {
        dom[prop] = work.props[prop];
      }
    });
  }

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
  // 转变成链表的总体规则如下：优先找 child孩子节点，没有孩子节点就找 sibling兄弟节点，没有孩子节点和兄弟节点，就找uncle叔叔节点。
  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }
  return work.parent?.sibling;
}

requestIdleCallback(workLoop);

const React = {
  createTextNode,
  createElement,
  render,
};

export default React;
