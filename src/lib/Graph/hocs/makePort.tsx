import * as React from "react";
import { DraggableInnerProps, makeDraggable } from "../hocs/makeDraggable";
import { IGraphNodePort } from "../types";
import { observer, inject } from "mobx-react";
import { undoManager } from "../../setUndoManager";
import { action } from "mobx";
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
    onStart = (e: React.MouseEvent) => {
      e.stopPropagation();

      undoManager.startGroup(() => {});
      this.props.port.beginNewConnection();
    };

    onDrag = (e: MouseEvent, { x, y }: { x: number; y: number }) => {
      console.log("port drag");
      const svgDelta = this.props.graphStore.clientToSvgPos(x, y);

      this.props.port.newConnection.setPosition({
        x: svgDelta.x,
        y: svgDelta.y
      });
    };

    onStop = () => {
      undoManager.stopGroup();
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
