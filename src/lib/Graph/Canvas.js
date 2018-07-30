import * as React from "react";
import * as svgPanZoom from "svg-pan-zoom";
import { observer } from "mobx-react";

@observer
export class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    const svgEl = this.svgRef.current;

    this.props.canvas.svgEl = svgEl;
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
    const { className, canvas, children, ...rest } = this.props;

    return (
      <div className={className} {...rest}>
        <svg
          id={"canvas"}
          ref={this.svgRef}
          viewBox={`0 0 1500 1500`}
          style={{
            display: "inline",
            width: "100%",
            height: "100%"
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>{children}</g>
        </svg>
      </div>
    );
  }
}
