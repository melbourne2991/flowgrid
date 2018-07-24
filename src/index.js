import React from "react";
import ReactDOM from "react-dom";
import { CreateGraph } from "./Graph";

import "./styles.css";

const { store, Graph } = CreateGraph({
  handlers: {
    onNewConnection(sourcePort, destinationPort) {
      if (sourcePort.type === "input" && destinationPort.type === "output") {
        return true;
      }

      if (destinationPort.type === "input" && sourcePort.type === "output") {
        return true;
      }

      return false;
    }
  }
});

const node1 = store.addNode("basic");

const node1Port1 = node1.addPort("input", {
  index: 0
});

const node1Port2 = node1.addPort("input", {
  index: 1
});

const node1Port3 = node1.addPort("output", {
  index: 0
});

const node2 = store.addNode("basic");

const node2Port1 = node2.addPort("input", {
  index: 0
});

const node2Port2 = node2.addPort("output", {
  index: 0
});

const node2Port3 = node2.addPort("output", {
  index: 1
});

function App() {
  return (
    <div className="App">
      <Graph store={store} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
