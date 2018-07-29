/**
 * In future refactor so that draggable, selectable and node extends from this class
 */
export class GraphObject {
  constructor(graph, parent) {
    this.graph = graph;
    this.parent = parent;
  }
}
