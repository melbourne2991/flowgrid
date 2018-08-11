import * as React from "react";
import { Draggable } from "../makeDraggable";
import { IGraphNodePort } from "../types";
import { observer, inject } from "mobx-react";
import { GraphStore } from "../GraphStore";
import { undoManager } from "../../setUndoManager";
import { action } from "mobx";

export interface PortProps {
  children: (props: PortInternalProps) => React.ReactElement<any>;
  port: IGraphNodePort<any>;
}

export interface PortInjectedProps {
  graphStore: GraphStore;
}

export interface PortInternalProps {
  dragging: boolean;
  startDragging: (e: React.MouseEvent) => void;
  port: IGraphNodePort<any>;
  requestConnection: (e: React.MouseEvent) => void;
}

@inject("graphStore")
@observer
export class Port extends React.Component<
  PortProps & { children: (props: PortInternalProps) => React.ReactChild }
> {
  onStart = (e: React.MouseEvent) => {
    e.stopPropagation();

    this.props.port.beginNewConnection();
  };

  onDrag = (e: MouseEvent, { x, y }: { x: number; y: number }) => {
    if (this.props.port.hasNewConnection()) {
      const svgDelta = (this.props as any).graphStore.clientToSvgPos(x, y);

      undoManager.startGroup(() => {
        this.props.port.newConnection.setPosition({
          x: svgDelta.x,
          y: svgDelta.y
        });
      });
    }
  };

  onStop = () => {
    undoManager.stopGroup();
  };

  @action
  requestConnection = () => {
    this.props.port.requestConnection();
  };

  render() {
    const { children, port } = this.props;

    return (
      <Draggable
        onStart={this.onStart}
        onDrag={this.onDrag}
        onStop={this.onStop}
      >
        {({ dragging, startDragging }) => {
          return children({
            dragging,
            startDragging,
            port,
            requestConnection: this.requestConnection
          });
        }}
      </Draggable>
    );
  }
}
