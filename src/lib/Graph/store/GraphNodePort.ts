import { observable, action } from "mobx";
import { DraggableStore, NewConnection, GraphNode } from "./";

export class GraphNodePort {
  id: string;
  node: GraphNode;
  type: string;
  draggable: DraggableStore;

  @observable connectedPorts: GraphNodePort[] = [];
  @observable newConnection: NewConnection = null;
  @observable data = {};

  constructor(id, node, type = "basic", data = {}) {
    this.node = node;
    this.id = id;
    this.type = type;
    this.data = data;

    this.draggable = new DraggableStore(this.node);
  }

  @action
  beginNewConnection = () => {
    this.newConnection = this.node.graph.beginNewConnection(this);
  };

  @action
  updateNewConnection = (deltaX, deltaY) => {
    this.newConnection.delta.x += deltaX / this.node.graph.canvas.CTM.a;
    this.newConnection.delta.y += deltaY / this.node.graph.canvas.CTM.d;
  };

  @action
  cancelNewConnection = () => {
    this.node.graph.cancelNewConnection();
    this.newConnection = null;
  };

  @action
  handlePotentialConnection = () => {
    this.node.graph.handlePotentialConnection(this);
  };
}
