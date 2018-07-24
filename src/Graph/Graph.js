import React from "react";

import { observer } from "mobx-react";
import { GraphStore } from "./store";
import { Canvas } from "./Canvas";
import { FlexLine } from "./FlexLine";
import { NodeWrapper } from "./NodeWrapper";

const NewConnection = observer(({ store, getPortBounds }) => {
  const { newConnection } = store;

  if (!newConnection) return null;

  const bounds = getPortBounds(newConnection.sourcePort);

  return (
    <svg>
      <FlexLine
        key={newConnection.id}
        a={bounds}
        b={{
          x: newConnection.delta.x + bounds.position.x,
          y: newConnection.delta.y + bounds.position.y
        }}
      />
    </svg>
  );
});

@observer
export class Graph extends React.Component {
  static CreateStore(...args) {
    return new GraphStore(...args);
  }

  mapNodes() {
    return this.props.store.nodes.map(node => {
      return (
        <NodeWrapper
          node={node}
          key={node.id}
          renderNode={this.props.nodeTypes[node.type].renderNode}
        />
      );
    });
  }

  handleScroll = e => {
    const posInWindowX =
      e.clientX - e.currentTarget.getBoundingClientRect().left;
    const posInWindowY =
      e.clientY - e.currentTarget.getBoundingClientRect().top;

    this.props.store.canvas.scaleCanvas(e.deltaY, posInWindowX, posInWindowY);
  };

  handleDrag = (e, data) => {
    this.props.store.canvas.panCanvas(data.deltaX, data.deltaY);
  };

  render() {
    const { scale } = this.props.store.canvas;
    const getPortBounds = getPortBoundsFn(this.props.nodeTypes);

    return (
      <Canvas canvas={this.props.store.canvas}>
        <NewConnection store={this.props.store} getPortBounds={getPortBounds} />
        {connectionsToFlexLine(this.props.store.connections, getPortBounds)}
        {this.mapNodes()}
      </Canvas>
    );
  }
}

function getPortBoundsFn(nodeTypes) {
  return port => nodeTypes[port.node.type].getPortBounds(port);
}

function connectionsToFlexLine(connections, getPortBounds) {
  return connections.map(({ ports, id }) => {
    return (
      <FlexLine
        key={id}
        a={getPortBounds(ports[0])}
        b={getPortBounds(ports[1])}
      />
    );
  });
}
