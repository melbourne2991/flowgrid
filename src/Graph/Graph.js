import React from "react";
import { Node } from "./Node";
import { observer } from "mobx-react";
import { GraphStore } from "./store";
import { Canvas } from "./Canvas";
import { FlexLine } from "./FlexLine";

@observer
export class Graph extends React.Component {
  static CreateStore(...args) {
    return new GraphStore(...args);
  }

  mapNodes() {
    return this.props.store.nodes.map(node => {
      return (
        <Node
          node={node}
          key={node.id}
          canvasCenter={{
            x: this.props.store.canvas.canvasCenterX,
            y: this.props.store.canvas.canvasCenterY
          }}
          canvasScale={this.props.store.canvas.scale}
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
            {newConnectionToFlexLine(this.props.store.newConnection)}
            {connectionsToFlexLine(this.props.store.connections)}
          </React.Fragment>
        )}
        renderNodes={() => this.mapNodes()}
      />
    );
  }
}

function connectionsToFlexLine(connections) {
  return connections.map(({ ports }) => {
    return (
      <FlexLine a={getPortPosition(ports[0])} b={getPortPosition(ports[1])} />
    );
  });
}

function newConnectionToFlexLine(newConnection) {
  if (!newConnection) return null;

  const { x, y } = getPortPosition(newConnection.sourcePort);

  return (
    <FlexLine
      a={{ x, y }}
      b={{
        x: newConnection.delta.x + x,
        y: newConnection.delta.y + y
      }}
    />
  );
}

function getPortPosition(port) {
  const { node, index } = port;

  const xOffset = 0;
  const yOffset = 50 * index + 25;

  const x = node.position.x + xOffset;
  const y = node.position.y + yOffset;

  return {
    x,
    y
  };
}
