import * as React from "react";
import { Canvas } from "./Canvas";
import { observer, Provider } from "mobx-react";
import { GraphStore } from "../GraphStore";
import { GraphNodes } from "./GraphNodes";
import {
  NodeTemplates,
  IGraphNodePort,
  IGraphConnection,
  GetPortBoundsFn
} from "../types";
import { FlexLine, Snapbox } from "./FlexLine";
import { Connection } from "./Connection";

export interface GraphProps {
  className?: string;
  nodeTemplates: NodeTemplates;
  store: GraphStore;
}

const mouseOffset = 3;

const NewConnection = observer(
  (props: { store: GraphStore; getPortBounds: Function }) => {
    const { newConnection } = props.store.graph;
    if (!newConnection || !newConnection.position) return null;

    const bounds = props.getPortBounds(newConnection.source);

    return (
      <FlexLine
        {...{
          strokeWidth: "4",
          stroke: "black",
          fill: "transparent"
        }}
        key={newConnection.id}
        a={bounds}
        b={{
          x:
            newConnection.position.x -
            mouseOffset * Math.sign(newConnection.position.x),
          y:
            newConnection.position.y -
            mouseOffset * Math.sign(newConnection.position.y)
        }}
      />
    );
  }
);

@observer
export class Graph extends React.Component<GraphProps> {
  render() {
    const { nodeTemplates, store, ...rest } = this.props;

    const portBoundsFn = getPortBoundsFn(nodeTemplates);

    return (
      <Provider graphStore={this.props.store}>
        <Canvas
          {...rest}
          setSvgMatrix={ctm => {
            store.svgMatrix = ctm.matrix;
            store.svgPoint = ctm.point;
          }}
          locked={store.canvasLocked}
        >
          <GraphNodes
            nodes={store.graph.nodes}
            nodeTemplates={nodeTemplates}
            graphStore={store}
          />

          <NewConnection store={store} getPortBounds={portBoundsFn} />
          {connectionsToFlexLine(
            this.props.store.graph.connections,
            portBoundsFn
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

function getPortBoundsFn(nodeTemplates: NodeTemplates): GetPortBoundsFn {
  return (port: IGraphNodePort<any>) =>
    nodeTemplates[port.node.template].getPortBounds(port);
}
