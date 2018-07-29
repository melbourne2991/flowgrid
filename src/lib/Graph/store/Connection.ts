import { observable } from "mobx";

export class Connection {
  @observable ports = [];

  id: string;

  constructor(id, ...ports) {
    this.id = id;
    this.ports = ports;
  }
}
