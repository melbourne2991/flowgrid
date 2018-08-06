import * as React from "react";
import { Graph, createGraphStore } from "../../lib/Graph";
import { GraphStore } from "../../lib/Graph/GraphStore";
import { BasicTemplate } from "./template";

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
      type: "input"
    });

    graphStore.addPortToNode(b, {
      type: "output"
    });

    graphStore.addPortToNode(b, {
      type: "output"
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
            basic: {
              renderNode: BasicTemplate,
              getPortBounds() {
                return {
                  position: { x: 0, y: 0 },
                  extents: 0
                };
              }
            }
          }}
        />
      </div>
    );
  }
}
