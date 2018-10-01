import { createBasicIONodeRenderer } from "./BasicIONode";
import { NodeTemplate, GetPortBoundsFn, IGraphNode } from "../../lib/Graph";
import { GraphNodeProps } from "../../lib/Graph/hocs/makeNode";
import { createBasicIONodePort } from "./BasicIONodePort";

import { InputOutputPortLayout, GetPortDimensionsFn } from "./PortLayout";

export interface BasicIONodeTemplateParams {
  portSize: number;
  nodeWidth: number;
  portRowHeight: number;
  borderRadius: number;
  renderCanvas: (node: IGraphNode) => React.ReactNode;
}

const nodeWidth = 200;
const portRowHeight = 30;
const portSize = 10;
const borderRadius = 3;

const defaultBasicIONodeTemplateParams = {
  portSize,
  nodeWidth,
  portRowHeight,
  borderRadius,
  renderCanvas: () => null
};

export class BasicIONodeTemplate implements NodeTemplate {
  renderNode: React.ComponentType<GraphNodeProps>;
  templateParams: BasicIONodeTemplateParams;
  getPortBounds: GetPortBoundsFn;
  getPortDimensions: GetPortDimensionsFn;

  constructor(
    templateParams: Partial<BasicIONodeTemplateParams> = defaultBasicIONodeTemplateParams
  ) {
    templateParams = templateParams || {};
    templateParams.portSize = templateParams.portSize || defaultBasicIONodeTemplateParams.portSize;
    templateParams.borderRadius = templateParams.borderRadius || defaultBasicIONodeTemplateParams.borderRadius;
    templateParams.nodeWidth = templateParams.nodeWidth || defaultBasicIONodeTemplateParams.nodeWidth;
    templateParams.portRowHeight = templateParams.portRowHeight || defaultBasicIONodeTemplateParams.portRowHeight;
    templateParams.renderCanvas = templateParams.renderCanvas || defaultBasicIONodeTemplateParams.renderCanvas;

    this.templateParams = templateParams as BasicIONodeTemplateParams;

    this.renderNode = createBasicIONodeRenderer(
      this,
      createBasicIONodePort(this)
    );

    const { getPortBounds, getPortDimensions } = new InputOutputPortLayout(
      this.templateParams
    );

    this.getPortDimensions = getPortDimensions;
    this.getPortBounds = getPortBounds;
  }
}
