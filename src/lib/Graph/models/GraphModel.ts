import { types, destroy, getEnv } from "mobx-state-tree";
import * as uniqid from "uniqid";
import { IGraphNodePort, IGraphNode, IGraphConnection } from "../types";

import { NodeModel } from "./NodeModel";
import { NewConnectionModel } from "./NewConnectionModel";
import { ConnectionModel } from "./ConnectionModel";
import { PortModel } from "./PortModel";

const Selectables = types.union(NodeModel, ConnectionModel);

export const GraphModel: any = types
  .model("Graph", {
    nodes: types.array(NodeModel),
    ports: types.array(PortModel),
    connections: types.array(ConnectionModel),
    newConnection: types.maybeNull(NewConnectionModel),
    selected: types.maybeNull(types.reference(Selectables))
  })
  .actions(self => ({
    addNode(node: any) {
      self.nodes.push(node);
      return node;
    },

    addPortToNode(node: IGraphNode<any>, port: IGraphNodePort<any>) {
      self.ports.push(port);
      node.addPort(port);

      return port;
    },

    addNewConnection(source: IGraphNodePort<any>) {
      getEnv(self).lockCanvas();

      self.newConnection = NewConnectionModel.create({
        id: uniqid(),
        source: source
      });

      return self.newConnection;
    },

    removeNewConnection() {
      if (self.newConnection) {
        self.newConnection.source.newConnection = null;
        destroy(self.newConnection);
        getEnv(self).unlockCanvas();
      }
    },

    removeConnection(connection: IGraphConnection) {
      destroy(connection as any);
    },

    connectionRequest(port: IGraphNodePort) {
      if (self.newConnection) {
        self.connections.push(
          ConnectionModel.create({
            id: uniqid(),
            source: self.newConnection.source,
            target: port
          })
        );

        port.connectedPorts.push(self.newConnection.source);
        self.newConnection.source.connectedPorts.push(port);
      }
    },

    removeNode(node: IGraphNode<any>) {
      destroy(node as any);
    },

    removePort(port: IGraphNodePort<any>) {
      destroy(port as any);
    },

    select(obj: any) {
      self.selected = obj;
    },

    deselect() {
      self.selected = null;
    }
  }));