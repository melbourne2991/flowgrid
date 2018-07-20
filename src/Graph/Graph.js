import React from "react";

import { observer } from "mobx-react";
import { GraphStore } from "./store";
import { Canvas } from "./Canvas";
import { FlexLine } from "./FlexLine";
import { NodeWrapper } from "./NodeWrapper";

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
    this.props.store.canvas.scaleCanvas(e.deltaY);
  };

  handleDrag = (e, data) => {
    this.props.store.canvas.panCanvas(data.deltaX, data.deltaY);
  };

  render() {
    const { scale } = this.props.store.canvas;
    const getPortBounds = getPortBoundsFn(this.props.nodeTypes);

    return (
      <Canvas
        canvas={{
          width: this.props.store.canvas.canvasWidth,
          height: this.props.store.canvas.canvasHeight,
          scale,
          translate: {
            x: this.props.store.canvas.translate.x,
            y: this.props.store.canvas.translate.y
          }
        }}
        canvasWindow={{
          width: this.props.store.canvas.canvasWindowWidth,
          height: this.props.store.canvas.canvasWindowHeight
        }}
        onDrag={this.handleDrag}
        onWheel={this.handleScroll}
        renderSvg={({ canvasCenter }) => (
          <React.Fragment>
            {newConnectionToFlexLine(
              this.props.store.newConnection,
              getPortBounds
            )}
            {connectionsToFlexLine(this.props.store.connections, getPortBounds)}
          </React.Fragment>
        )}
        renderNodes={() => this.mapNodes()}
      />
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

function newConnectionToFlexLine(newConnection, getPortBounds) {
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
}
