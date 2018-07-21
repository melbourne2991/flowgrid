import React from "react";
import { css } from "emotion";
import svgPanZoom from "svg-pan-zoom";

export class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    svgPanZoom(this.svgRef.current, {
      beforePan: () => {
        if (this.props.canvas.locked) {
          return false;
        }

        return true;
      },

      onUpdatedCTM: CTM => {
        this.props.canvas.CTM = CTM;
      }
    });
  }

  render() {
    return (
      <svg
        id={"canvas"}
        ref={this.svgRef}
        width={this.props.canvas.canvasWidth}
        height={this.props.canvas.canvasHeight}
        viewBox={`0 0 ${this.props.canvas.canvasWidth} ${
          this.props.canvas.canvasHeight
        }`}
        className={css({
          border: "1px solid #000"
        })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>{this.props.children}</g>
      </svg>
    );
  }
}
