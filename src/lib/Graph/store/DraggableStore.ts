import { observable, action } from "mobx";
import { GraphNode } from "./";

export class DraggableStore {
  @observable dragging: boolean = false;

  @observable lastX: number = null;
  @observable lastY: number = null;

  @observable x: number = null;
  @observable y: number = null;

  node: GraphNode;

  constructor(node) {
    this.node = node;
  }

  @action
  start(x, y) {
    this.node.graph.canvas.locked = true;
    this.dragging = true;

    this.lastX = x;
    this.lastY = y;

    this.x = x;
    this.y = y;
  }

  @action
  drag(x, y) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.x = x;
    this.y = y;

    const deltaX = this.x - this.lastX;
    const deltaY = this.y - this.lastY;

    const result = {
      x,
      y,
      deltaX,
      deltaY
    };

    return result;
  }

  @action
  stop() {
    this.node.graph.canvas.locked = false;
    this.dragging = false;
    this.lastX = null;
    this.lastY = null;
    this.x = null;
    this.y = null;
  }
}
