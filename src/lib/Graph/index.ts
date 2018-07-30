import { GraphStore, CanvasStore } from "./store";
import { GraphConfig } from "./types";
export { Graph } from "./Graph";
export { PortWrapper } from "./PortWrapper";
export { NodeWrapper } from "./NodeWrapper";

const defaultCanvasConfig = {};
const defaultNodeTemplates = {};
const defaultHandlers = {};

export { graphEvents } from "./events";

export function CreateGraphStore(
  config: Partial<GraphConfig> = {
    canvas: {},
    nodeTemplates: {},
    handlers: {}
  }
) {
  const mergedConfig: GraphConfig = {
    canvas: {
      ...defaultCanvasConfig,
      ...config.canvas
    },

    nodeTemplates: {
      ...defaultNodeTemplates,
      ...config.nodeTemplates
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
