import React from "react";
import ReactDOM from "react-dom";
import { Graph } from "./Graph";

import "./styles.css";

const store = Graph.CreateStore();

const node1 = store.addNode();

const node1Port1 = node1.addPort();
const node1Port2 = node1.addPort();
const node1Port3 = node1.addPort();

const node2 = store.addNode();

const node2Port1 = node2.addPort();
const node2Port2 = node2.addPort();
const node2Port3 = node2.addPort();

function App() {
  return (
    <div className="App">
      <Graph store={store} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
