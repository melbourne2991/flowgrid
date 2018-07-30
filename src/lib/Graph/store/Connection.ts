import { observable } from "mobx";
import { Serializeable } from "../../../types";
import { SerializedGraphNodePort } from "./GraphNodePort";

export class Connection implements Serializeable<SerializedConnection> {
  @observable ports = [];

  id: string;

  constructor(id, ...ports) {
    this.id = id;
    this.ports = ports;
  }

  serialize() {
    return {
      id: this.id,
      ports: this.ports.map(port => port.serialize())
    };
  }

  deserialize() {}
}

export interface SerializedConnection {
  id: string;
  ports: SerializedGraphNodePort[];
}
