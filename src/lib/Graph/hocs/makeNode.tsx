import * as React from "react";
import { observer, inject } from "mobx-react";
import { IGraphNode } from "../types";
import { GraphStore } from "../GraphStore";

import { makeDraggable, DraggableInnerProps } from "./makeDraggable";

export interface GraphNodesProps {
  nodes: IGraphNode<any>[];
  graphStore: GraphStore;
}

export interface GraphNodeProps {
  node: IGraphNode<any>;
}

export type GraphNodeInternalProps = DraggableInnerProps<
  GraphNodeProps & {
    selectNode(): void;
  }
>;

export function makeNode(
  Component: React.ComponentType<GraphNodeInternalProps>
): React.ComponentType<GraphNodeProps> {
  const DraggableComponent = makeDraggable(Component);

  @observer
  class GraphNode extends React.Component<
    GraphNodeProps & { graphStore: GraphStore }
  > {
    get engine() {
      return this.props.graphStore.engine;
    }

    onStart = () => {
      this.engine.handleBeginDragNode(this.props.node);
    };

    onDrag = (e: MouseEvent, delta: { deltaX: number; deltaY: number }) => {
      this.engine.handleDragNode(this.props.node, delta);
    };

    onStop = () => {
      this.engine.handleEndDragNode(this.props.node);
    };

    onSelect = () => {
      this.engine.handleSelectNode(this.props.node);
    };

    render() {
      const { node } = this.props;

      return (
        <DraggableComponent
          node={node}
          onStart={this.onStart}
          onStop={this.onStop}
          onDrag={this.onDrag}
          dragging={node.dragging}
          selectNode={this.onSelect}
        />
      );
    }
  }

  return inject("graphStore")(GraphNode);
}
