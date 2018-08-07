import * as React from "react";
import { observer } from "mobx-react";
import { NodeTemplates, IGraphNode, NodeTemplate } from "../types";
import { Draggable } from "../makeDraggable";
import { GraphStore } from "../GraphStore";

export interface GraphNodesProps {
  nodes: IGraphNode<any>[];
  nodeTemplates: NodeTemplates;
  graphStore: GraphStore;
}

export interface GraphNodeProps {
  template: NodeTemplate;
  node: IGraphNode<any>;
  graphStore: GraphStore;
}

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

    node.updatePosition(node.x + svgDelta.x, node.y + svgDelta.y);
  };

  onStop = () => {
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
      <React.Fragment>
        {this.props.nodes.map(node => {
          const template = this.props.nodeTemplates[node.template];

          return (
            <React.Fragment key={node.id}>
              <GraphNode
                node={node}
                template={template}
                graphStore={this.props.graphStore}
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}
