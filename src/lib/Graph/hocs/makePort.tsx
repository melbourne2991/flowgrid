import * as React from "react";
import { DraggableInnerProps, makeDraggable } from "../hocs/makeDraggable";
import { IGraphNodePort } from "../types";
import { observer, inject } from "mobx-react";
import { GraphStore } from "..";

export type PortProps<T> = T & {
  port: IGraphNodePort<any>;
};

export type PortInternalProps<P> = P &
  DraggableInnerProps<PortInternalPropsNoDraggable>;

export type PortInternalPropsNoDraggable = {
  graphStore: GraphStore;
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
    get engine() {
      return this.props.graphStore.engine;
    }

    onStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      this.engine.handleBeginDragNewConnection(this.props.port);
    };

    onDrag = (e: MouseEvent, delta: { x: number; y: number }) => {
      this.engine.handleDragNewConnection(this.props.port.newConnection, delta);
    };

    onStop = () => {
      this.engine.handleEndDragNewConnection(this.props.port.newConnection);
    };

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
