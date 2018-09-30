import { types, destroy, getEnv } from "mobx-state-tree";
import * as uniqid from "uniqid";
import { NodeModel } from "./NodeModel";
import { NewConnectionModel } from "./NewConnectionModel";
import { ConnectionModel } from "./ConnectionModel";
import { PortModel } from "./PortModel";
import {
  IGraphNodePort,
  IGraphNode,
  IGraphConnection,
  SelectionMode
} from "../types";
import { GraphStore } from "..";

const Selectables = types.union(NodeModel, ConnectionModel);

export const GraphModel: any = types
  .model("Graph", {
    nodes: types.array(NodeModel),
    ports: types.array(PortModel),
    connections: types.array(ConnectionModel),
    newConnection: types.maybeNull(NewConnectionModel),
    selected: types.array(types.reference(Selectables)),
    selectionMode: types.union(types.literal("single"), types.literal("multi"))
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
      const graphStore = getEnv(self).graphStore() as GraphStore;
      graphStore.lockCanvas();

      self.newConnection = NewConnectionModel.create({
        id: uniqid(),
        source: source,
        connectablePorts: graphStore.engine.getConnectablePorts(source)
      });

      return self.newConnection;
    },

    removeNewConnection() {
      if (self.newConnection) {
        (self.newConnection as any).source.newConnection = null;
        destroy(self.newConnection);
        getEnv(self)
          .graphStore()
          .unlockCanvas();
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
            source: (self.newConnection as any).source,
            target: port
          })
        );

        port.connectedPorts.push((self.newConnection as any).source);
        (self.newConnection as any).source.connectedPorts.push(port);
      }
    },

    removeNode(node: IGraphNode<any>) {
      destroy(node as any);
    },

    removePort(port: IGraphNodePort<any>) {
      destroy(port as any);
    },

    select(obj: any) {
      if (self.selectionMode === "single") {
        self.selected.length = 0;
      }

      self.selected.push(obj);
    },

    updateSelectionMode(selectionMode: SelectionMode) {
      self.selectionMode = selectionMode;
    },

    deselect(obj: any) {
      // is it obj or obj.id?
      const index = self.selected.indexOf(obj);

      if (index > -1) {
        self.selected.splice(index, 1);
      }
    },

    deselectAll() {
      self.selected.length = 0;
    }
  }));
