import { NodeType } from "../nodeTypes/types";

export interface RootStoreParams {
  nodeTypes: NodeType[];
}

export class RootStore {
  stores: { [storeName: string]: {} } = {};
  nodeTypes: NodeType[];

  constructor({ nodeTypes }: RootStoreParams) {
    this.nodeTypes = nodeTypes;
  }
}
