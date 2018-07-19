import React from "react";
import ReactDOM from "react-dom";
import { Graph } from "./Graph";

import "./styles.css";

const store = Graph.CreateStore();
const node = store.addNode();
const port1 = node.addPort();
const port2 = node.addPort();
const port3 = node.addPort();

function App() {
  return (
    <div className="App">
      <Graph store={store} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
