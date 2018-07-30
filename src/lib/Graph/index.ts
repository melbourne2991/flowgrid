import { GraphStore, CanvasStore } from "./store";
import { GraphConfig } from "./types";
export { Graph } from "./Graph";
export { PortWrapper } from "./PortWrapper";
export { NodeWrapper } from "./NodeWrapper";

const defaultCanvasConfig = {};
const defaultNodeTypes = {};
const defaultHandlers = {};

export { graphEvents } from "./events";

export function CreateGraphStore(
  config: Partial<GraphConfig> = {
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

  const canvas = new CanvasStore();

  const store = new GraphStore({
    config: mergedConfig,
    canvas
  });

  return store;
}
