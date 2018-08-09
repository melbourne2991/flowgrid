import { types, destroy, getEnv, detach } from "mobx-state-tree";
import * as uniqid from "uniqid";
import {
  IGraphNodePort,
  IGraphNode,
  IGraph,
  Point,
  IGraphConnection
} from "../types";
import { GraphStore } from "../GraphStore";

function getGraph(self: any): IGraph {
  return getEnv(self).graph;
}

function selfIsSelected(self: any): boolean {
  const selectedItem = getEnv(self).graph.selected;

  if (selectedItem && selectedItem.id === self.id) {
    return true;
  }

  return false;
}

const SelectableModel = types
  .model("Selectable", {})
  .actions(self => ({
    select() {
      getGraph(self).select(self);
    }
  }))
  .views(self => ({
    get selected() {
      return selfIsSelected(self);
    }
  }));

const createNodeModel = (PortModel: any) => {
  return types
    .compose(
      SelectableModel,
      types
        .model({
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
          }
        }))
    )
    .named("Node");
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
      newConnection: types.maybeNull(types.reference(NewConnectionModel)),
      newConnectionProximity: types.union(types.number, types.boolean)
    })
    .actions(self => ({
      // how close this is to a new connection endpoint
      updateNewConnectionProximity(distance: number | false) {
        self.newConnectionProximity = distance;
      },

      beginNewConnection() {
        self.newConnection = getGraph(self).addNewConnection(
          self as any
        ) as any;
      },

      hasNewConnection() {
        return !!self.newConnection;
      },

      requestConnection() {
        getGraph(self).connectionRequest(self as any);
      },

      cancelNewConnection() {
        if (!self.newConnection) {
          console.warn("Tried to destroy a connection when none existed.");
        } else {
          getGraph(self).removeNewConnection();
        }
      }
    }));
};

const createConnectionModel = (PortModel: any) =>
  types
    .compose(
      SelectableModel,
      types.model("Connection", {
        id: types.identifier,
        source: types.reference(PortModel),
        target: types.reference(PortModel)
      })
    )
    .named("Connection");

const createNewConnectionModel = (PortModel: any) =>
  types
    .model("NewConnection", {
      id: types.identifier,
      source: types.reference(PortModel),
      x: types.maybeNull(types.number),
      y: types.maybeNull(types.number),
      closestPort: types.maybeNull(types.reference(PortModel))
    })
    .actions(self => ({
      beforeDestroy() {
        if (self.closestPort) {
          (self.closestPort as any).updateNewConnectionProximity(false);
        }
      },

      setPosition(pos: Point) {
        self.x = pos.x;
        self.y = pos.y;

        const result = getEnv<GraphStore>(self).findClosestPortToPoint({
          x: self.x,
          y: self.y
        });

        if (
          self.closestPort &&
          (!result || result.closestPort.id !== (self.closestPort as any).id)
        ) {
          (self.closestPort as any).updateNewConnectionProximity(false);
          self.closestPort = null;
        } else if (result) {
          (self.closestPort as any) = result.closestPort;
          (self.closestPort as any).updateNewConnectionProximity(
            result.distance
          );
        }
      }
    }))
    .views(self => ({
      get position() {
        if (self.x && self.y) {
          return {
            x: self.x,
            y: self.y
          };
        }

        return null;
      }
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
};

export {
  createNodeModel,
  createPortModel,
  createConnectionModel,
  createNewConnectionModel,
  createGraphModel
};
