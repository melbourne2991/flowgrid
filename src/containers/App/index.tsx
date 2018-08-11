import * as React from "react";
import { Graph } from "../../lib/Graph";
import { inject } from "mobx-react";
import { GraphStore } from "../../stores/GraphStore";

const injector = inject("graphStore");

class AppComponent extends React.Component<{ graphStore: GraphStore }> {
  constructor(props: { graphStore: GraphStore }) {
    super(props);

    console.log(props.graphStore);

    // const a = graphStore.addNode("basic", {});
    // const b = graphStore.addNode("basic", {});

    // graphStore.addPortToNode(a, {
    //   type: "input",
    //   label: "Helloaa",
    //   index: 0
    // });

    // graphStore.addPortToNode(b, {
    //   type: "output",
    //   label: "Helloba",
    //   index: 0
    // });

    // graphStore.addPortToNode(b, {
    //   type: "output",
    //   label: "Hellobb",
    //   index: 1
    // });

    // a.updatePosition(100, 100);
    // b.updatePosition(200, 200);

    // this.state = {
    //   graphStore
    // };
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
