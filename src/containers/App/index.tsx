import * as React from "react";
import { Graph, createGraphStore } from "../../lib/Graph";
import { GraphStore } from "../../lib/Graph/GraphStore";
import { basic } from "./template";

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
      index: 0
    });

    graphStore.addPortToNode(b, {
      type: "output",
      index: 0
    });

    graphStore.addPortToNode(b, {
      type: "output",
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
      <div style={{ width: "1000px", height: "800px", border: "1px solid" }}>
        <Graph
          store={this.state.graphStore}
          nodeTemplates={{
            basic
          }}
        />
      </div>
    );
  }
}
