import React from "./core/React.js";
import ReactDom from "./core/ReactDom.js";
import App from "./App.jsx";

const root = document.getElementById("root");
ReactDom.createRoot(root).render(<App></App>);
// ReactDom.createRoot(root).render(App);
