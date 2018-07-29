import * as shortid from "shortid";

import { GraphStore, DraggableStore, SelectableStore, GraphNodePort } from "./";
import { observable, action } from "mobx";

export class GraphNode {
  id: string;
  graph: GraphStore;
  type: string;
  draggable: DraggableStore;
  selectable: SelectableStore;

  @observable ports = [];
  @observable
  position = {
    x: 0,
    y: 0
  };

  @observable data = {};

  constructor(id, graph, type = "basic", data = {}) {
    this.type = type;
    this.graph = graph;
    this.id = id;
    this.data = data;

    this.position.x = this.graph.canvas.canvasCenterX;
    this.position.y = this.graph.canvas.canvasCenterY;

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
}
