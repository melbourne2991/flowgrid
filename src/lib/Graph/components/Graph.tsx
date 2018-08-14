import * as React from "react";
import { Canvas } from "./Canvas";
import { observer, Provider } from "mobx-react";
import { GraphStore } from "../GraphStore";
import { GraphNodes } from "./GraphNodes";
import { NewConnection } from "./NewConnection";

import { IGraphNodePort, IGraphConnection } from "../types";

import { Snapbox } from "./FlexLine";
import { Connection } from "./Connection";

export interface GraphProps {
  className?: string;
  store: GraphStore;
  style: Object;
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
          <GraphNodes
            nodes={store.graph.nodes}
            nodeTemplates={store.nodeTemplates}
            graphStore={store}
          />

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
