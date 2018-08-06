import * as React from "react";
import { Draggable } from "../makeDraggable";
import { IGraphNodePort } from "../types";
import { observer } from "mobx-react";

export interface PortProps {
  children: (props: PortInternalProps) => React.ReactElement<any>;
  port: IGraphNodePort<any>;
}

export interface PortInternalProps {
  dragging: boolean;
  startDragging: (e: React.MouseEvent) => void;
  port: IGraphNodePort<any>;
}

@observer
export class Port extends React.Component<
  PortProps & { children: (props: PortInternalProps) => React.ReactChild }
> {
  onStart = (e: React.MouseEvent) => {
    e.stopPropagation();

    this.props.port.beginNewConnection();
    console.log("started!");
  };

  onDrag = (
    e: MouseEvent,
    { deltaX, deltaY }: { deltaX: number; deltaY: number }
  ) => {
    if (this.props.port.newConnection) {
      this.props.port.newConnection.setDelta({ x: deltaX, y: deltaY });
    }
  };

  componentDidMount() {
    document.addEventListener("mouseup", e => {
      if (this.props.port.newConnection) {
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
