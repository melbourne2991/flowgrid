import * as React from "react";
import { observer } from "mobx-react";
import { PortPositionData } from "./";
import {
  makePort,
  PortInternalProps,
  PortProps
} from "../../lib/Graph/hocs/makePort";
import * as Color from "color";
import { BasicIONodeTemplate } from "./";

export type BasicIONodePortProps = PortProps<{
  portDimensions: PortPositionData;
}>;

export type BasicIONodePortInternalProps = PortInternalProps<
  BasicIONodePortProps
>;

export function createBasicIONodePort(template: BasicIONodeTemplate) {
  @observer
  class BasicIONodePortComponent extends React.Component<
    BasicIONodePortInternalProps
  > {
    render() {
      const { port, portDimensions } = this.props;

      let fillOverride = "#ccc";

      if (
        port.newConnectionProximity !== false &&
        port.newConnectionProximity < 100
      ) {
        fillOverride = Color("#424242")
          .lighten(port.newConnectionProximity / 100)
          .hex();
      }

      return (
        <React.Fragment>
          <rect
            fill={fillOverride}
            shapeRendering="crispEdges"
            style={{
              width: `${template.templateParams.portSize}px`,
              height: `${template.templateParams.portSize}px`
            }}
            x={portDimensions.x}
            y={portDimensions.y}
            onMouseDown={e => {
              e.stopPropagation();
              this.props.startDragging(e);
            }}
            onMouseUp={e => {
              this.props.requestConnection(e);
            }}
          />

          <text
            style={{
              fontSize: "10px",
              lineHeight: `1`,
              fontWeight: "bolder"
            }}
            {...portDimensions.text}
          >
            {port.data.label}
          </text>
        </React.Fragment>
      );
    }
  }

  return makePort<BasicIONodePortProps>(BasicIONodePortComponent);
}
