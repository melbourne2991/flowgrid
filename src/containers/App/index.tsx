import * as React from "react";
import { Graph } from "../../lib/Graph";
import { inject } from "mobx-react";
import { GraphStore } from "../../stores/GraphStore";

const injector = inject("graphStore");

class AppComponent extends React.Component<{ graphStore: GraphStore }> {
  constructor(props: { graphStore: GraphStore }) {
    super(props);
  }

  render() {
    return (
      <Graph
        style={{ background: "#afafaf" }}
        store={this.props.graphStore.visualGraphStore}
      />
    );
  }
}

export const App = injector(AppComponent) as React.ComponentType<{}>;
