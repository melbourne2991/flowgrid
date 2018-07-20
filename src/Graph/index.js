import { Graph as GraphComponent } from "./Graph";
import { GraphStore, CanvasStore } from "./store";
import { withProps } from "recompose";
import { BasicNode } from "./builtins/BasicNode";

export { GraphComponent as Graph };

const defaultCanvasConfig = {
  canvasWidth: 50000,
  canvasHeight: 50000,

  canvasWindowWidth: 1500,
  canvasWindowHeight: 800
};

const defaultNodeTypes = {
  basic: BasicNode
}

const defaultHandlers = {
};

export function CreateGraph(config = {
  canvas = {},
  nodeTypes = {},
  handlers = {}
}) {
  const config = {
    canvas: {
      ...defaultCanvasConfig,
      ...canvas
    },

    nodeTypes: {
      ...defaultNodeTypes,
      ...nodeTypes
    },

    handlers: {
      ...defaultHandlers,
      ...handlers
    }
  };

  const canvas = new CanvasStore(config.canvas);
  const store = new GraphStore({
    canvas
  });

  return {
    store,
    Graph: withProps({
      nodeTypes: config.nodeTypes
    })(GraphComponent)
  };
}
