import { observable } from "mobx";
import { GraphNodePort } from "./";

export class NewConnection {
  id: string;

  @observable sourcePort: GraphNodePort = null;

  @observable
  delta = {
    x: 0,
    y: 0
  };

  constructor(id, sourcePort) {
    this.id = id;
    this.sourcePort = sourcePort;
    this.delta = {
      x: 0,
      y: 0
    };
  }
}
