import * as React from "react";
import * as svgPanZoom from "svg-pan-zoom";
import { observer } from "mobx-react";
import { SvgFilters } from "./SvgFilters";

export interface CanvasProps {
  className?: string;
  setSvgMatrix?: (svg: { matrix: SVGMatrix; point: SVGPoint }) => void;
  locked?: boolean;
  onMouseUp?: (e: React.MouseEvent) => void;
}

@observer
export class Canvas extends React.Component<CanvasProps> {
  svgRef: React.RefObject<SVGSVGElement>;

  constructor(props: CanvasProps) {
    super(props);

    this.svgRef = React.createRef();
  }

  componentDidMount() {
    const svgEl = this.svgRef.current!;
    const svgPoint = svgEl.createSVGPoint();
    const svgMatrix = svgEl.createSVGMatrix();

    this.props.setSvgMatrix &&
      this.props.setSvgMatrix({ matrix: svgMatrix, point: svgPoint });

    svgPanZoom(this.svgRef.current!, {
      dblClickZoomEnabled: false,
      fit: false,
      center: false,

      beforePan: () => {
        if (this.props.locked) {
          return false;
        }

        return true;
      },

      onUpdatedCTM: matrix => {
        this.props.setSvgMatrix &&
          this.props.setSvgMatrix({ matrix, point: svgPoint });
      }
    });
  }

  render() {
    const { className, children, setSvgMatrix, locked, ...rest } = this.props;

    return (
      <div
        style={{ width: "100%", height: "100%" }}
        className={className}
        {...rest}
      >
        <svg
          id={"canvas"}
          ref={this.svgRef}
          style={{
            display: "inline",
            width: "100%",
            height: "100%"
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <SvgFilters />
          </defs>
          <g>{children}</g>
        </svg>

        <div id={"dom-canvas"} />
      </div>
    );
  }
}
