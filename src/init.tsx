import * as React from "react";
import * as ReactDOM from "react-dom";
import { Graph, createGraphStore } from "./lib/Graph";

import { basic } from "./nodeTemplates/basic";
import { canvas } from "./nodeTemplates/canvas";

export function init() {
  const rootElement: HTMLElement = document.getElementById("root")!;

  const graphStore = createGraphStore({
    nodeTemplates: { basic, canvas }
  });

  const visualNode = graphStore.addNode(Math.random().toString(), basic, {});

  graphStore.addPortToNode(visualNode, {
    type: "input",
    label: "Some input",
    index: 0
  });

  graphStore.addPortToNode(visualNode, {
    type: "output",
    label: "Some output",
    index: 0
  });

  const visualNode2 = graphStore.addNode(Math.random().toString(), basic, {});

  graphStore.addPortToNode(visualNode2, {
    type: "input",
    label: "Some input",
    index: 0
  });

  graphStore.addPortToNode(visualNode2, {
    type: "output",
    label: "Some output",
    index: 0
  });

  ReactDOM.render(
    <div
      style={{
        background: "#ccc",
        width: "100%",
        height: "100%",
        position: "absolute"
      }}
    >
      <Graph store={graphStore} />
    </div>,
    rootElement
  );
}
