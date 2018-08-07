import * as React from "react";
import { Draggable } from "../makeDraggable";
import { IGraphNodePort } from "../types";
import { observer, inject } from "mobx-react";
import { GraphStore } from "../GraphStore";

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

  onDrag = (
    e: MouseEvent,
    { deltaX, deltaY }: { deltaX: number; deltaY: number }
  ) => {
    if (this.props.port.newConnection) {
      const svgDelta = (this.props as any).graphStore.clientDeltaToSvg(
        deltaX,
        deltaY
      );
      this.props.port.newConnection.setDelta({
        x: this.props.port.newConnection.x + svgDelta.x,
        y: this.props.port.newConnection.y + svgDelta.y
      });
    }
  };

  componentDidMount() {
    document.addEventListener("mouseup", e => {
      if (this.props.port.hasNewConnection()) {
        this.props.port.cancelNewConnection();
      }
    });
  }

  render() {
    const { children, port } = this.props;

    return (
      <Draggable onStart={this.onStart} onDrag={this.onDrag}>
        {({ dragging, startDragging }) => {
          return children({ dragging, startDragging, port });
        }}
      </Draggable>
    );
  }
}
