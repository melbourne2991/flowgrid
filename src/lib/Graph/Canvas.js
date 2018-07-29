import React from "react";
import svgPanZoom from "svg-pan-zoom";

export class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    const svgEl = this.svgRef.current;

    this.props.canvas.SVGPoint = svgEl.createSVGPoint();

    svgPanZoom(this.svgRef.current, {
      dblClickZoomEnabled: false,

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
      <div className={this.props.className}>
        <svg
          id={"canvas"}
          ref={this.svgRef}
          viewBox={`0 0 ${this.props.canvas.canvasWidth} ${
            this.props.canvas.canvasHeight
          }`}
          style={{
            display: "inline",
            width: "100%",
            height: "100%"
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>{this.props.children}</g>
        </svg>
      </div>
    );
  }
}
