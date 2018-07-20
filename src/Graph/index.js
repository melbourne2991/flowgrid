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

  constructor(props) {
    super(props);
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
        onMouseMove={e => {
          // const posInWindowX =
          //   e.clientX - e.currentTarget.getBoundingClientRect().left;
          // const posInWindowY =
          //   e.clientY - e.currentTarget.getBoundingClientRect().top;
        }}
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
        renderSvg={({ canvasCenter }) =>
          newConnectionToFlexLine(this.props.store.newConnection)
        }
        renderNodes={() => this.mapNodes()}
      />
    );
  }
}

function newConnectionToFlexLine(newConnection) {
  if (!newConnection) return null;

  const { node, index } = newConnection.sourcePort;

  const xOffset = 0;
  const yOffset = 50 * index + 25;

  const x = node.position.x + xOffset;
  const y = node.position.y + yOffset;

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

// function getCanvasWindowToCanvas(canvasWindowDimensions, canvasDimensions) {
//   return (pos) => {
//     return {
//       x: canvasDimensions.width / 2 - canvasWindowDimensions.width / 2,
//     }
//   }
// }
