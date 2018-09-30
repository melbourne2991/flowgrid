import { IGraphNodePort } from "../../lib/Graph";

export type PortPositionData = {
  x: number;
  y: number;
  text: {
    x: number;
    y: number;
    textAnchor: string;
  };
};

export type InputOutputPortPositionDataMap = {
  input: (index: number) => PortPositionData;
  output: (index: number) => PortPositionData;
};

export interface BasicIONodeTemplateParams {
  portSize: number;
  nodeWidth: number;
  portRowHeight: number;
  portRowOffset: number;
  inPortXOffset: number;
  outPortXOffset: number;
  borderRadius: number;
}

export interface InputOutputPortLayoutParams {
  portSize: number;
  nodeWidth: number;
  portRowHeight: number;
}

export type GetPortDimensionsFn = (port: IGraphNodePort) => PortPositionData;

export class InputOutputPortLayout {
  portSize: number;
  outPortXOffset: number;
  portRowHeight: number;
  inPortXOffset: number;
  portRowOffset: number;

  portDimensionMap: InputOutputPortPositionDataMap;

  constructor(params: InputOutputPortLayoutParams) {
    this.portSize = params.portSize;
    this.portRowHeight = params.portRowHeight;
    this.portRowOffset = params.portRowHeight / 2 - params.portSize / 2;
    this.inPortXOffset = 0;
    this.outPortXOffset = params.nodeWidth - params.portSize;

    this.portDimensionMap = {
      input: this.calculateInputDimensions,
      output: this.calculateOutputDimensions
    };
  }

  getPortBounds = (port: IGraphNodePort) => {
    const { node, data } = port;

    // flex line expects position to be center of the port
    const xOffset =
      data.type === "input"
        ? this.portSize / 2
        : this.outPortXOffset + this.portSize / 2;

    const yOffset = this.portRowHeight * data.index + this.portRowHeight / 2;
    const x = node.x + xOffset;
    const y = node.y + yOffset;

    return {
      position: {
        x,
        y
      },

      // extents is half size
      extents: this.portSize / 2
    };
  };

  getPortDimensions = (port: IGraphNodePort): PortPositionData => {
    const inputOrOutput = this.portDimensionMap[
      port.data.type as keyof InputOutputPortPositionDataMap
    ];

    return inputOrOutput(port.data.index);
  };

  calculateInputDimensions = (i: number): PortPositionData => {
    const { inPortXOffset, portRowHeight, portRowOffset, portSize } = this;

    return {
      x: inPortXOffset,
      y: i * portRowHeight + portRowOffset,
      text: {
        x: inPortXOffset + portSize * 2,
        y: i * portRowHeight + portRowOffset + 9,
        textAnchor: "start"
      }
    };
  };

  calculateOutputDimensions = (i: number): PortPositionData => {
    const { outPortXOffset, portRowHeight, portRowOffset, portSize } = this;

    return {
      x: outPortXOffset,
      y: i * portRowHeight + portRowOffset,
      text: {
        x: outPortXOffset - portSize,
        y: i * portRowHeight + (portRowOffset + 9),
        textAnchor: "end"
      }
    };
  };
}
