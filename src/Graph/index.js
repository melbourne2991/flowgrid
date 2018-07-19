import React from "react";
import { Node } from "./Node";
import { observer } from "mobx-react";
import { GraphStore } from "./store";
import { Canvas } from "./Canvas";

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
        renderSvg={({ canvasCenter }) => (
          <rect
            x={this.props.store.canvas.canvasCenterX}
            y={this.props.store.canvas.canvasCenterY}
            width="300"
            height="100"
            style={{
              fill: "rgb(0,0,255)"
            }}
          />
        )}
        renderNodes={() => this.mapNodes()}
      />
    );
  }
}

// function getCanvasWindowToCanvas(canvasWindowDimensions, canvasDimensions) {
//   return (pos) => {
//     return {
//       x: canvasDimensions.width / 2 - canvasWindowDimensions.width / 2,
//     }
//   }
// }
