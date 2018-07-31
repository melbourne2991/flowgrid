import { observable, action } from "mobx";
import { DraggableStore, NewConnection, GraphNode } from "./";
import { SerializeableObject, SerializeableDict } from "../../../types";
import { GraphObject } from "./GraphObject";

export interface GraphNodePortParams {
  node: GraphNode;
  type: string;
  data: SerializeableDict;
}

export class GraphNodePort extends GraphObject
  implements SerializeableObject<SerializedGraphNodePort> {
  id: string;
  node: GraphNode;
  type: string;
  draggable: DraggableStore;

  @observable connectedPorts: GraphNodePort[] = [];
  @observable newConnection: NewConnection = null;
  @observable data: SerializeableDict = {};

  constructor(graph, id, params: GraphNodePortParams) {
    super(graph);

    this.node = params.node;
    this.id = id;
    this.type = params.type;
    this.data = params.data;

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

  serialize() {
    return {
      id: this.id,
      data: this.data,
      type: this.type
    };
  }

  deserialize(serialized) {
    this.id = serialized.id;
    this.data = serialized.data;
    this.type = serialized.type;
  }
}

export interface SerializedGraphNodePort {
  id: string;
  data: SerializeableDict;
  type: string;
}
