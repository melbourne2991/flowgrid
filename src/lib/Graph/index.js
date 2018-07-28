import { GraphStore, CanvasStore } from "./store";
export { Graph } from "./Graph";
export { PortWrapper } from "./PortWrapper";
export { NodeWrapper } from "./NodeWrapper";

const defaultCanvasConfig = {
  canvasWidth: 1500,
  canvasHeight: 800,

  canvasWindowWidth: 1500,
  canvasWindowHeight: 800
};

const defaultNodeTypes = {};
const defaultHandlers = {};

export function CreateGraphStore(
  config = {
    canvas: {},
    nodeTypes: {},
    handlers: {}
  }
) {
  const mergedConfig = {
    canvas: {
      ...defaultCanvasConfig,
      ...config.canvas
    },

    nodeTypes: {
      ...defaultNodeTypes,
      ...config.nodeTypes
    },

    handlers: {
      ...defaultHandlers,
      ...config.handlers
    }
  };

  const canvas = new CanvasStore(mergedConfig.canvas);

  const store = new GraphStore({
    config: mergedConfig,
    canvas
  });

  return store;
}
