import * as React from "react";
import { Graph, createGraphStore } from "../../lib/Graph";
import { GraphStore } from "../../lib/Graph/GraphStore";
import { basic } from "./template";
import { withStyles } from "@material-ui/core";

export interface AppState {
  graphStore: GraphStore;
}

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    const graphStore = createGraphStore();

    const a = graphStore.addNode("basic", {});
    const b = graphStore.addNode("basic", {});

    graphStore.addPortToNode(a, {
      type: "input",
      label: "Hello",
      index: 0
    });

    graphStore.addPortToNode(b, {
      type: "output",
      label: "Hello",
      index: 0
    });

    graphStore.addPortToNode(b, {
      type: "output",
      label: "Hello",
      index: 1
    });

    a.updatePosition(100, 100);
    b.updatePosition(200, 200);

    this.state = {
      graphStore
    };
  }

  render() {
    return (
      <Graph
        style={{ background: "#afafaf" }}
        store={this.state.graphStore}
        nodeTemplates={{
          basic
        }}
      />
    );
  }
}
