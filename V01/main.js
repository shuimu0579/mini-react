// v1
// const dom = document.getElementById("app");

// const elementDom = document.createElement("div");
// elementDom.id = "app";
// dom.appendChild(elementDom);

// const textDom = document.createTextNode("");
// textDom.nodeValue = "app";
// elementDom.appendChild(textDom);

// v2
// const text_vnode = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "app",
//     children: [],
//   },
// };

// const element_vnode = {
//   type: "div",
//   props: {
//     id: "app",
//     children: [text_vnode],
//   },
// };

// const dom = document.getElementById("app");

// const elementDom = document.createElement(element_vnode.type);
// elementDom.id = element_vnode.props["id"];
// dom.appendChild(elementDom);

// const textDom = document.createTextNode("");
// textDom.nodeValue = text_vnode.props["nodeValue"];
// elementDom.appendChild(textDom);

// v3
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
      children,
    },
  };
}

const textEl = createTextNode("app");
const App = createElement(
  "div",
  {
    id: "app",
  },
  textEl
);

const root = document.getElementById("root");

// const elementDom = document.createElement(App.type);
// elementDom.id = App.props["id"];
// root.append(elementDom);

// const textDom = document.createTextNode("");
// textDom.nodeValue = textEl.props["nodeValue"];
// elementDom.append(textDom);

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

render(App, root);
