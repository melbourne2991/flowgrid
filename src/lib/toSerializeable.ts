import { SerializeableDict, Serializeable } from "../types";
import assign = require("lodash/assign");

export function toSerializeable<T extends SerializeableDict>(
  obj: T
): Serializeable<T> {
  const self = {
    deserialize: serialized => {
      assign(self, serialized);
    },

    serialize: () => {
      const { serialize, deserialize, ...rest } = self;
      return rest as T;
    },
    ...(obj as {})
  };

  return self;
}
