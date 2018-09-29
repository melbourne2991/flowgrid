import { createBasicIONodeRenderer } from "./BasicIONode";
import { NodeTemplate, GetPortBoundsFn } from "../../lib/Graph";
import { GraphNodeProps } from "../../lib/Graph/hocs/makeNode";
import { createBasicIONodePort } from "./BasicIONodePort";
import {
  InputOutputPortLayout,
  GetPortDimensionsFn
} from "../../lib/PortLayout";

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
  output: (indeX: number) => PortPositionData;
};

export interface BasicIONodeTemplateParams {
  portSize: number;
  nodeWidth: number;
  portRowHeight: number;
  borderRadius: number;
}

export const defaultBasicIONodeTemplateParams = (() => {
  const nodeWidth = 200;
  const portRowHeight = 30;
  const portSize = 10;
  const borderRadius = 3;

  return {
    portSize,
    nodeWidth,
    portRowHeight,
    borderRadius
  };
})();

export class BasicIONodeTemplate implements NodeTemplate {
  renderNode: React.ComponentType<GraphNodeProps>;
  templateParams: BasicIONodeTemplateParams;
  getPortBounds: GetPortBoundsFn;
  getPortDimensions: GetPortDimensionsFn;

  constructor(
    templateParams: BasicIONodeTemplateParams = defaultBasicIONodeTemplateParams
  ) {
    this.templateParams = templateParams;

    this.renderNode = createBasicIONodeRenderer(
      this,
      createBasicIONodePort(this)
    );

    const { getPortBounds, getPortDimensions } = new InputOutputPortLayout(
      templateParams
    );

    this.getPortDimensions = getPortDimensions;
    this.getPortBounds = getPortBounds;
  }
}
