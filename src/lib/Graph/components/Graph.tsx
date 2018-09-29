import * as React from "react";
import { Canvas } from "./Canvas";
import { observer, Provider } from "mobx-react";
import { GraphStore } from "../GraphStore";
import { NewConnection } from "./NewConnection";
import { IGraphConnection } from "../types";
import { Connection } from "./Connection";

export interface GraphProps {
  className?: string;
  store: GraphStore;
  style?: Object;
}

@observer
export class Graph extends React.Component<GraphProps> {
  get graph() {
    return this.props.store.graph;
  }

  mapNodes() {
    return this.graph.nodes.map(node => {
      return <node.template.renderNode key={node.id} node={node} />;
    });
  }

  mapConnections() {
    return this.graph.connections.map((connection: IGraphConnection) => {
      return (
        <Connection
          key={connection.id}
          getPortBounds={this.props.store.getPortBounds}
          connection={connection}
        />
      );
    });
  }

  render() {
    const { store, ...rest } = this.props;

    return (
      <Provider graphStore={this.props.store}>
        <Canvas
          {...rest}
          setSvgMatrix={this.props.store.setSvgMatrix}
          locked={store.canvasLocked}
        >
          <NewConnection store={store} />

          {this.mapNodes()}
          {this.mapConnections()}
        </Canvas>
      </Provider>
    );
  }
}
