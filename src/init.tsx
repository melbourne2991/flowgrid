import * as React from "react";
import * as ReactDOM from "react-dom";
import { Graph, createGraphStore } from "./lib/Graph";
import { BasicIONodeTemplate } from "./nodeTemplates/basic";

export function init() {
  const rootElement: HTMLElement = document.getElementById("root")!;

  const basic = new BasicIONodeTemplate();

  const graphStore = createGraphStore();
  const visualNode = graphStore.addNode(basic, {});

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

  const visualNode2 = graphStore.addNode(basic, {});

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

  graphStore.addPortToNode(visualNode2, {
    type: "output",
    label: "Some output",
    index: 1
  });

  const visualNode3 = graphStore.addNode(basic, {});

  graphStore.addPortToNode(visualNode3, {
    type: "input",
    label: "Some input",
    index: 0
  });

  graphStore.addPortToNode(visualNode3, {
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
