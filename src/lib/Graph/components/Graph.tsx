import * as React from "react";
import { Canvas } from "./Canvas";
import { observer, Provider } from "mobx-react";
import { GraphStore } from "../GraphStore";
import { GraphNodes } from "./GraphNodes";
import { NodeTemplates, IGraphNodePort } from "../types";
import { FlexLine } from "./FlexLine";

export interface GraphProps {
  className?: string;
  nodeTemplates: NodeTemplates;
  store: GraphStore;
}

const NewConnection = observer(
  (props: { store: GraphStore; getPortBounds: Function }) => {
    const { newConnection } = props.store.graph;
    if (!newConnection) return null;

    const bounds = props.getPortBounds(newConnection.source);

    console.log(newConnection.position);

    return (
      <FlexLine
        key={newConnection.id}
        a={bounds}
        b={{
          x: newConnection.position.x + bounds.position.x,
          y: newConnection.position.y + bounds.position.y
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
        </Canvas>
      </Provider>
    );
  }
}

function getPortBoundsFn(nodeTemplates: NodeTemplates) {
  return (port: IGraphNodePort<any>) =>
    nodeTemplates[port.node.template].getPortBounds(port);
}
