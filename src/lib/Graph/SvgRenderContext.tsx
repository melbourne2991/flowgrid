import { observer, inject } from "mobx-react";
import { GraphStore } from "./GraphStore";
import * as ReactDOM from "react-dom";

export interface SVGRenderContextProps {
  x: number;
  y: number;
  children: (
    {
      style: {}
    }
  ) => React.ReactElement<any>;
}

/**
 * Allows for dom elements to live in SVG dimensions / coords.
 * Will scale and position them in svg space.
 */
export const SVGRenderContext: React.SFC<SVGRenderContextProps> = inject(
  "graphStore"
)(
  observer(function SVGRenderContext({ children, graphStore, x, y }) {
    const domCanvas = document.getElementById("dom-canvas");
    const clientPos = (graphStore as GraphStore).svgToClientPos(x, y);

    if (domCanvas) {
      const matrix = clientPos.matrix as SVGMatrix;

      const transform = `matrix(${matrix.a}, ${matrix.b}, ${matrix.c}, ${
        matrix.d
      }, ${clientPos.x}, ${clientPos.y}) translate(-50%)`;

      const style = {
        position: "absolute",
        top: 0,
        left: 0,
        transformOrigin: "top left",
        transform
      };

      return ReactDOM.createPortal(
        (children as any)({
          style
        }),
        domCanvas
      ) as any;
    }

    return null;
  })
);
