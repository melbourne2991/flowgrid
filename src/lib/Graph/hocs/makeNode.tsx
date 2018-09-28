import * as React from "react";
import { observer, inject } from "mobx-react";
import { IGraphNode, NodeTemplate } from "../types";
import { GraphStore } from "../GraphStore";

import { undoManager } from "../../setUndoManager";
import { makeDraggable, DraggableInnerProps } from "./makeDraggable";

export interface GraphNodesProps {
  nodes: IGraphNode<any>[];
  graphStore: GraphStore;
}

export interface GraphNodeProps {
  node: IGraphNode<any>;
}

export type GraphNodeInternalProps = DraggableInnerProps<GraphNodeProps>;

export function makeNode(
  Component: React.ComponentType<DraggableInnerProps<GraphNodeProps>>
): React.ComponentType<GraphNodeProps> {
  const DraggableComponent = makeDraggable(Component);

  @observer
  class GraphNode extends React.Component<
    GraphNodeInternalProps & { graphStore: GraphStore }
  > {
    onStart = () => {
      // Not sure why start / stop dragging are not captured as part of the
      // group, this seems to work as an alternative however.
      undoManager.withoutUndo(() => {
        this.props.node.startDragging();
      });

      this.props.graphStore.lockCanvas();
    };

    onDrag = (
      e: MouseEvent,
      { deltaX, deltaY }: { deltaX: number; deltaY: number }
    ) => {
      const { node } = this.props;
      const svgDelta = this.props.graphStore.clientDeltaToSvg(deltaX, deltaY);

      undoManager.startGroup(() => {
        node.updatePosition(node.x + svgDelta.x, node.y + svgDelta.y);
      });
    };

    onStop = () => {
      undoManager.stopGroup();

      undoManager.withoutUndo(() => {
        this.props.node.stopDragging();
      });

      this.props.graphStore.unlockCanvas();
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
        />
      );
    }
  }

  return inject("graphStore")(GraphNode);
}
