import { GraphStore } from "../GraphStore";
import {
  IGraphNode,
  IGraphConnection,
  IGraphNodePort,
  IGraphNewConnection,
  Point
} from "../types";

export class GraphEngine {
  graphStore: GraphStore;

  handleSelectNode = (node: IGraphNode) => {
    node.select();
  };

  handleBeginDragNode = (node: IGraphNode) => {
    this.graphStore.undoManager.startGroup(() => {});
    node.startDragging();

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
    node.stopDragging();
    this.graphStore.unlockCanvas();
    this.graphStore.undoManager.stopGroup();
  };

  handleBeginDragNewConnection = (port: IGraphNodePort) => {
    this.graphStore.undoManager.startGroup(() => {});
    port.beginNewConnection();
  };

  handleDragNewConnection = (
    newConnection: IGraphNewConnection,
    delta: Point
  ) => {
    const svgDelta = this.graphStore.clientToSvgPos(delta.x, delta.y);

    newConnection.setPosition({
      x: svgDelta.x,
      y: svgDelta.y
    });
  };

  handleEndDragNewConnection = (newConnection: IGraphNewConnection) => {
    // If there is an available port
    if (newConnection.closestPort) {
      newConnection.closestPort.requestConnection();
    }

    this.graphStore.graph.removeNewConnection();
    this.graphStore.undoManager.stopGroup();
  };

  handleConnectionRequest = () => {};

  handleSelectConnection = (connection: IGraphConnection) => {
    connection.select();
  };
}
