import * as React from "react";
import { DraggableInnerProps, makeDraggable } from "../makeDraggable";
import { IGraphNodePort } from "../types";
import { observer, inject } from "mobx-react";
import { undoManager } from "../../setUndoManager";
import { action } from "mobx";

export type PortProps<T> = T & {
  port: IGraphNodePort<any>;
};

export type PortInternalProps<P> = P &
  DraggableInnerProps<PortInternalPropsNoDraggable>;

export type PortInternalPropsNoDraggable = {
  dragging: boolean;
  port: IGraphNodePort<any>;
  requestConnection: (e: React.MouseEvent) => void;
};

export function makePort<T>(
  Component: React.ComponentType<DraggableInnerProps<PortInternalProps<T>>>
): React.ComponentType<PortProps<T>> {
  const DraggableComponent = observer(makeDraggable(Component));

  @observer
  class Port extends React.Component<PortInternalProps<T>> {
    onStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("on start received");
      this.props.port.beginNewConnection();
    };

    onDrag = (e: MouseEvent, { x, y }: { x: number; y: number }) => {
      console.log("on drag received");

      const isDraggable = this.props.port.hasNewConnection;
      console.log(isDraggable);

      const svgDelta = (this.props as any).graphStore.clientToSvgPos(x, y);

      undoManager.startGroup(() => {
        this.props.port.newConnection.setPosition({
          x: svgDelta.x,
          y: svgDelta.y
        });
      });
    };

    onStop = () => {
      undoManager.stopGroup();
    };

    @action
    requestConnection = () => {
      this.props.port.requestConnection();
    };

    render() {
      const { port, ...rest } = this.props as any;

      return (
        <DraggableComponent
          requestConnection={this.requestConnection}
          onStart={this.onStart}
          onDrag={this.onDrag}
          onStop={this.onStop}
          port={port}
          dragging={port.hasNewConnection}
          {...rest}
        />
      );
    }
  }

  return inject("graphStore")(Port);
}
