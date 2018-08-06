import { types, destroy, getEnv } from "mobx-state-tree";
import * as uniqid from "uniqid";
import { IGraphNodePort, IGraphNode, IGraph, Point } from "../types";

function getGraph(self: any): IGraph {
  return getEnv(self).graph;
}

const createNodeModel = (PortModel: any) => {
  return types
    .model("Node", {
      id: types.identifier,
      template: types.string,
      ports: types.array(types.reference(PortModel)),
      x: types.number,
      y: types.number,
      data: types.frozen()
    })
    .actions(self => ({
      addPort(port: any) {
        self.ports.push(port);
      },

      updatePosition(x: number, y: number) {
        self.x = x;
        self.y = y;
      },

      select() {
        getGraph(self).select(self);
      }
    }))
    .views(self => ({
      get selected() {
        const selectedItem = getEnv(self).graph.selected;

        if (selectedItem && selectedItem.id === self.id) {
          return true;
        }

        return false;
      }
    }));
};

const createPortModel = (
  NodeModel: any,
  PortModel: any,
  NewConnectionModel: any
) => {
  return types
    .model("Port", {
      id: types.identifier,
      node: types.reference(NodeModel),
      connectedPorts: types.late(() => types.array(types.reference(PortModel))),
      data: types.frozen(),
      newConnection: types.maybeNull(types.reference(NewConnectionModel))
    })
    .actions(self => ({
      beginNewConnection() {
        return (self.newConnection = getGraph(self).addNewConnection(
          self as any
        ) as any);
      },

      hasNewConnection() {
        return !!self.newConnection;
      },

      cancelNewConnection() {
        getGraph(self).removeNewConnection();

        console.warn("Tried to destroy non existing connection.");
      }
    }));
};

const createConnectionModel = (PortModel: any) =>
  types.model("Connection", {
    id: types.identifier,
    source: types.reference(PortModel),
    destination: types.reference(PortModel)
  });

const createNewConnectionModel = (PortModel: any) =>
  types
    .model("NewConnection", {
      id: types.identifier,
      source: types.reference(PortModel),
      x: types.number,
      y: types.number
    })
    .actions(self => ({
      setDelta(delta: Point) {
        self.x = delta.x;
        self.y = delta.y;
      }
    }))
    .views(self => ({
      position: () => ({
        x: self.x,
        y: self.y
      })
    }));

const createGraphModel = (
  NodeModel: any,
  PortModel: any,
  ConnectionModel: any,
  NewConnectionModel: any
) => {
  const Selectables = types.union(NodeModel, ConnectionModel);

  return types
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
          source: source,
          x: 0,
          y: 0
        });

        return self.newConnection;
      },

      removeNewConnection() {
        if (self.newConnection) {
          destroy(self.newConnection);
          getEnv(self).unlockCanvas();
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
};

export {
  createNodeModel,
  createPortModel,
  createConnectionModel,
  createNewConnectionModel,
  createGraphModel
};
