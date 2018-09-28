import { types } from "mobx-state-tree";
import { NodeModel } from "./NodeModel";
import { NewConnectionModel } from "./NewConnectionModel";
import { getGraph } from "./helpers/getGraph";

export const PortModel: any = types
  .model("Port", {
    id: types.identifier,
    node: types.reference(types.late(() => NodeModel)),
    connectedPorts: types.late(() => types.array(types.reference(PortModel))),
    data: types.frozen(),
    newConnection: types.maybeNull(
      types.reference(types.late(() => NewConnectionModel))
    ),
    newConnectionProximity: types.union(types.number, types.boolean)
  })
  .actions(self => ({
    // how close this is to a new connection endpoint
    updateNewConnectionProximity(distance: number | false) {
      self.newConnectionProximity = distance;
    },

    beginNewConnection() {
      self.newConnection = getGraph(self).addNewConnection(self as any) as any;
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
  }))
  .views(self => ({
    get hasNewConnection() {
      return !!self.newConnection;
    }
  }));
