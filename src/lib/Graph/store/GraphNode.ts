import * as shortid from "shortid";

import { GraphStore, DraggableStore, SelectableStore, GraphNodePort } from "./";
import { observable, action } from "mobx";
import { SerializeableObject, SerializeableDict } from "../../../types";
import { SerializedGraphNodePort } from "./GraphNodePort";

const defaultData = {};

export class GraphNode implements SerializeableObject<SerializedGraphNode> {
  id: string;
  graph: GraphStore;
  template: string;
  draggable: DraggableStore;
  selectable: SelectableStore;

  @observable data: SerializeableDict;
  @observable ports: GraphNodePort[] = [];

  @observable
  position = {
    x: 0,
    y: 0
  };

  constructor(
    id: string,
    graph: GraphStore,
    template: string,
    data = defaultData
  ) {
    this.template = template;
    this.graph = graph;
    this.id = id;
    this.data = data;

    this.draggable = new DraggableStore(this);
    this.selectable = new SelectableStore(this);
  }

  @action
  addPort = (type, data) => {
    const port = new GraphNodePort(shortid.generate(), this, type, data);
    this.ports.push(port);
    return port;
  };

  @action
  updatePositionWithDelta = (deltaX, deltaY) => {
    this.position.x += deltaX / this.graph.canvas.CTM.a;
    this.position.y += deltaY / this.graph.canvas.CTM.d;
  };

  @action
  updatePositionWithClientOffset = (clientX, clientY) => {
    const svgPos = this.graph.canvas.clientToSVGPoint(clientX, clientY);

    this.position.x = svgPos.x;
    this.position.y = svgPos.y;
  };

  serialize() {
    return {
      id: this.id,
      position: {
        x: this.position.x,
        y: this.position.y
      },
      template: this.template,
      data: this.data,
      ports: this.ports.map(port => port.serialize())
    };
  }

  deserialize(serialized) {}
}

export interface SerializedGraphNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {};
  template: string;
  ports: SerializedGraphNodePort[];
}
