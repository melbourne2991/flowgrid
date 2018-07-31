import { observable } from "mobx";
import { GraphNodePort } from "./";
import { GraphObject } from "./GraphObject";
import { GraphStore } from "./GraphStore";

export interface NewConnectionParams {
  sourcePort: GraphNodePort;
}

export class NewConnection extends GraphObject {
  id: string;

  @observable sourcePort: GraphNodePort = null;

  @observable
  delta = {
    x: 0,
    y: 0
  };

  constructor(graph: GraphStore, id: string, params: NewConnectionParams) {
    super(graph);

    this.id = id;
    this.sourcePort = params.sourcePort;
    this.delta = {
      x: 0,
      y: 0
    };
  }
}
