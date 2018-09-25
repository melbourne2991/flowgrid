import * as React from "react";
import { observer } from "mobx-react";
import { IGraphNode, NodeTemplate } from "../types";
import { Draggable } from "../makeDraggable";
import { GraphStore } from "../GraphStore";

import { undoManager } from "../../setUndoManager";

export interface GraphNodesProps {
  nodes: IGraphNode<any>[];
  graphStore: GraphStore;
}

export interface GraphNodeProps {
  template: NodeTemplate;
  node: IGraphNode<any>;
  graphStore: GraphStore;
}

@observer
export class GraphNode extends React.Component<GraphNodeProps> {
  onStart = () => {
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

    this.props.graphStore.unlockCanvas();
  };

  render() {
    const { node, template } = this.props;

    return (
      <Draggable
        onStart={this.onStart}
        onDrag={this.onDrag}
        onStop={this.onStop}
      >
        {({ dragging, startDragging }) => (
          <template.renderNode
            node={node}
            dragging={dragging}
            startDragging={startDragging}
          />
        )}
      </Draggable>
    );
  }
}

@observer
export class GraphNodes extends React.Component<GraphNodesProps> {
  render() {
    return (
      <React.Fragment key={"graph-nodes"}>
        {this.props.nodes.map(node => {
          return (
            <React.Fragment key={node.id}>
              <GraphNode
                node={node}
                template={node.template}
                graphStore={this.props.graphStore}
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}
