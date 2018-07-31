import * as shortid from "shortid";

import { GraphStore, DraggableStore, SelectableStore, GraphNodePort } from "./";
import { observable, action } from "mobx";
import { SerializeableObject, SerializeableDict } from "../../../types";
import { SerializedGraphNodePort } from "./GraphNodePort";
import { Point } from "../types";
import { GraphObject } from "./GraphObject";

export interface GraphNodeParams {
  template: string;
  data: SerializeableDict;
}

export class GraphNode extends GraphObject
  implements SerializeableObject<SerializedGraphNode> {
  id: string;
  graph: GraphStore;
  template: string;
  draggable: DraggableStore;
  selectable: SelectableStore;

  @observable data: SerializeableDict;
  @observable ports: GraphNodePort[] = [];

  @observable
  position: Point = {
    x: 0,
    y: 0
  };

  constructor(graph: GraphStore, id: string, params: GraphNodeParams) {
    super(graph);

    this.template = params.template;
    this.graph = graph;
    this.id = id;
    this.data = params.data;

    this.draggable = new DraggableStore(this);
    this.selectable = new SelectableStore(this);
  }

  @action
  addPort = (type, data) => {
    const port = this.graph.createWithId("GraphNodePort", {
      node: this,
      type,
      data
    });

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

  deserialize(serialized: SerializedGraphNode) {
    this.id = serialized.id;
    this.position.x = serialized.position.x;
    this.position.y = serialized.position.y;
    this.template = serialized.template;
    this.data = serialized.data;

    this.ports = serialized.ports.map(serializedPort => {
      return this.graph.create("GraphNodePort", serializedPort.id, {
        node: this,
        type: serializedPort.type,
        data: serializedPort.data
      });
    });
  }
}

export interface SerializedGraphNode {
  id: string;
  position: Point;
  template: string;
  data: SerializeableDict;
  ports: SerializedGraphNodePort[];
}
