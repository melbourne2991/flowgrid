import { GraphStore } from "../GraphStore";

import {
  IGraphNode,
  IGraphConnection,
  IGraphNodePort,
  IGraphNewConnection,
  Point,
  IGraphSelectableObject,
  SelectionMode
} from "../types";

export class GraphEngine {
  graphStore: GraphStore;

  handleNodeSelectionChange = (node: IGraphNode) => {
    this.graphStore.undoManager.withoutUndo(() => {
      if (!node.selected) {
        node.select();
      } else if (this.graphStore.graph.selectionMode === "multi") {
        node.deselect();
      }
    });
  };

  handleBeginDragNode = (node: IGraphNode) => {
    this.graphStore.undoManager.withoutUndo(() => {
      node.startDragging();
    });

    this.graphStore.undoManager.startGroup(() => {});

    this.graphStore.lockCanvas();
  };

  handleDragNode = (
    node: IGraphNode,
    { deltaX, deltaY }: { deltaX: number; deltaY: number }
  ) => {
    const svgDelta = this.graphStore.clientDeltaToSvg(deltaX, deltaY);

    node.updatePosition(node.x + svgDelta.x, node.y + svgDelta.y);
  };

  handleEndDragNode = (node: IGraphNode) => {
    this.graphStore.unlockCanvas();
    this.graphStore.undoManager.stopGroup();

    this.graphStore.undoManager.withoutUndo(() => {
      node.stopDragging();
    });
  };

  handleBeginDragNewConnection = (port: IGraphNodePort) => {
    this.graphStore.undoManager.withoutUndo(() => {
      port.beginNewConnection();
    });
  };

  handleDragNewConnection = (
    newConnection: IGraphNewConnection,
    delta: Point
  ) => {
    const svgDelta = this.graphStore.clientToSvgPos(delta.x, delta.y);

    this.graphStore.undoManager.withoutUndo(() => {
      newConnection.setPosition({
        x: svgDelta.x,
        y: svgDelta.y
      });
    });
  };

  handleEndDragNewConnection = (newConnection: IGraphNewConnection) => {
    // If there is an available port
    if (newConnection.closestPort) {
      newConnection.closestPort.requestConnection();
    }

    this.graphStore.undoManager.withoutUndo(() => {
      this.graphStore.graph.removeNewConnection();
    });
    this.graphStore.undoManager.stopGroup();
  };

  handleConnectionRequest = () => {};

  handleBeginDragSelect = () => {};

  handleUpdateSelectionMode = (selectionMode: SelectionMode) => {
    this.graphStore.undoManager.withoutUndo(() => {
      this.graphStore.graph.updateSelectionMode(selectionMode);
    });
  };

  handleDelete = (selected: IGraphSelectableObject[]) => {
    this.graphStore.undoManager.startGroup(() => {});

    selected.forEach(obj => {
      if (obj.type === "node") {
        this.graphStore.removeNode(obj as IGraphNode);
      } else if (obj.type === "connection") {
        this.graphStore.removeConnection(obj as IGraphConnection);
      }
    });

    this.graphStore.undoManager.stopGroup();
  };

  handleSelectConnection = (connection: IGraphConnection) => {
    connection.select();
  };

  getConnectablePorts(port: IGraphNodePort) {
    // Any port that does not belong to this node
    return this.graphStore.graph.nodes
      .filter(node => node.id !== port.node.id)
      .reduce(
        (acc, node) => {
          acc.push(...node.ports);
          return acc;
        },
        [] as IGraphNodePort[]
      );
  }
}
