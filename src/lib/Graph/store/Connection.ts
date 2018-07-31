import { observable } from "mobx";
import { SerializeableObject } from "../../../types";
import { SerializedGraphNodePort, GraphNodePort } from "./GraphNodePort";
import { GraphObject } from "./GraphObject";

export interface ConnectionParams {
  ports: GraphNodePort[];
}

export class Connection extends GraphObject
  implements SerializeableObject<SerializedConnection> {
  @observable ports: GraphNodePort[] = [];

  id: string;

  constructor(graph, id, params: ConnectionParams) {
    super(graph);

    this.id = id;
    this.ports = params.ports;
  }

  serialize() {
    return {
      id: this.id,
      ports: this.ports.map(port => port.serialize())
    };
  }
}

export interface SerializedConnection {
  id: string;
  ports: SerializedGraphNodePort[];
}
