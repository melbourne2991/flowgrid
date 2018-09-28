import * as React from "react";
import { Canvas } from "./Canvas";
import { observer, Provider } from "mobx-react";
import { GraphStore } from "../GraphStore";
import { NewConnection } from "./NewConnection";

import { IGraphNodePort, IGraphConnection } from "../types";

import { Snapbox } from "./FlexLine";
import { Connection } from "./Connection";

export interface GraphProps {
  className?: string;
  store: GraphStore;
  style?: Object;
}

@observer
export class Graph extends React.Component<GraphProps> {
  onMouseUp = () => {
    if (this.props.store.graph.newConnection) {
      if (this.props.store.graph.newConnection.closestPort) {
        this.props.store.graph.newConnection.closestPort.requestConnection();
      }

      this.props.store.graph.removeNewConnection();
    }
  };

  mapNodes() {
    return this.props.store.graph.nodes.map(node => {
      return <node.template.renderNode key={node.id} node={node} />;
    });
  }

  render() {
    const { store, ...rest } = this.props;

    return (
      <Provider graphStore={this.props.store}>
        <Canvas
          {...rest}
          onMouseUp={this.onMouseUp}
          setSvgMatrix={ctm => {
            store.svgMatrix = ctm.matrix;
            store.svgPoint = ctm.point;
          }}
          locked={store.canvasLocked}
        >
          {this.mapNodes()}

          <NewConnection store={store} />
          {connectionsToFlexLine(
            this.props.store.graph.connections,
            this.props.store.getPortBounds
          )}
        </Canvas>
      </Provider>
    );
  }
}

function connectionsToFlexLine(
  connections: IGraphConnection[],
  getPortBounds: (port: IGraphNodePort) => Snapbox
) {
  return connections.map((connection: IGraphConnection) => {
    return (
      <Connection
        key={connection.id}
        getPortBounds={getPortBounds}
        connection={connection}
      />
    );
  });
}
