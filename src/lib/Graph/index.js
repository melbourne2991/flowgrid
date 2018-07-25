import { GraphStore, CanvasStore } from "./store";
import { BasicNode } from "./builtins/BasicNode";
export { Graph } from "./Graph";

const defaultCanvasConfig = {
  canvasWidth: 1500,
  canvasHeight: 800,

  canvasWindowWidth: 1500,
  canvasWindowHeight: 800
};

const defaultNodeTypes = {
  basic: BasicNode
};

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
