import { NodeTypeDefinition } from "../lib/types";
import { SerializeableObject } from "../types";
import {
  FlowGraphStore,
  SerializedFlowGraphStore
} from "../containers/FlowGraph/store";

export interface RootStoreParams {
  nodeTypes: NodeTypeDefinition[];
}

export interface SerializedRootStore {
  stores: {
    flowGraphStore: SerializedFlowGraphStore;
  };
}

export class RootStore implements SerializeableObject<SerializedRootStore> {
  stores: { flowGraphStore: FlowGraphStore };
  nodeTypes: NodeTypeDefinition[];

  constructor({ nodeTypes }: RootStoreParams) {
    this.nodeTypes = nodeTypes;
  }

  serialize() {
    return {
      stores: {
        flowGraphStore: this.stores.flowGraphStore.serialize()
      }
    };
  }

  deserialize(serialized) {
    this.stores.flowGraphStore.deserialize(serialized.stores.flowGraphStore);
  }
}
