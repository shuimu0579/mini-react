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
  console.log("vnode", vnode);
  console.log("container", container);
  const dom =
    vnode.type !== "TEXT_ELEMENT"
      ? document.createElement(vnode.type)
      : document.createTextNode("");

  Object.keys(vnode.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = vnode.props[prop];
    }
  });
  container.append(dom);

  const children = vnode.props.children;
  children.forEach((child) => {
    render(child, dom);
  });
}

const React = {
  createTextNode,
  createElement,
  render,
};

export default React;
