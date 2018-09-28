import * as React from "react";
import { observer } from "mobx-react";
import { IGraphNode } from "../types";
import { GraphStore } from "../GraphStore";

export interface GraphNodesProps {
  nodes: IGraphNode<any>[];
  graphStore: GraphStore;
}

@observer
export class GraphNodes extends React.Component<GraphNodesProps> {
  render() {
    return (
      <React.Fragment key={"graph-nodes"}>
        {this.props.nodes.map(node => {
          return <node.template.renderNode key={node.id} node={node} />;
        })}
      </React.Fragment>
    );
  }
}
