import { types, getEnv } from "mobx-state-tree";
import { Point } from "../types";
import { GraphStore } from "../GraphStore";
import { PortModel } from "./PortModel";

export const NewConnectionModel: any = types
  .model("NewConnection", {
    id: types.identifier,
    source: types.reference(types.late(() => PortModel)),
    x: types.maybeNull(types.number),
    y: types.maybeNull(types.number),
    closestPort: types.maybeNull(types.late(() => types.reference(PortModel)))
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
        (self.closestPort as any).updateNewConnectionProximity(result.distance);
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
