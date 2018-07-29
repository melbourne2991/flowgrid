import * as React from "react";

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
    <FlexLine
      key={newConnection.id}
      a={bounds}
      b={{
        x: newConnection.delta.x + bounds.position.x,
        y: newConnection.delta.y + bounds.position.y
      }}
    />
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
          renderNode={this.props.store.config.nodeTypes[node.type].renderNode}
        />
      );
    });
  }

  handleMouseDown = () => {
    this.props.store.activeSelection = null;
  };

  render() {
    const getPortBounds = getPortBoundsFn(this.props.store.config.nodeTypes);

    return (
      <Canvas
        canvas={this.props.store.canvas}
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
      >
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
