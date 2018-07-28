export class RootStore {
  stores = {};

  constructor({ nodeTypes }) {
    this.nodeTypes = nodeTypes;
  }
}
