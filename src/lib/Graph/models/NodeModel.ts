import { types } from "mobx-state-tree";
import { SelectableModel } from "./SelectableModel";
import { PortModel } from "./PortModel";

export const NodeModel: any = types
  .compose(
    SelectableModel,
    types
      .model({
        type: "node",
        id: types.identifier,
        template: types.frozen(),
        ports: types.array(types.reference(types.late(() => PortModel))),
        x: types.number,
        y: types.number,
        dragging: types.boolean,
        data: types.frozen()
      })
      .actions(self => ({
        addPort(port: any) {
          self.ports.push(port);
        },

        startDragging() {
          self.dragging = true;
        },

        stopDragging() {
          self.dragging = false;
        },

        updatePosition(x: number, y: number) {
          self.x = x;
          self.y = y;
        },

        updateData(data: any) {
          self.data = data;
        }
      }))
  )
  .named("Node");
