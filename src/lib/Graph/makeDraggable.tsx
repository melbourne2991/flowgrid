import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

export interface DragData {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
}

export type DraggableInnerProps<P> = P & {
  startDragging: (e: React.MouseEvent) => void;
};

export type DraggableProps<P> = P & {
  onStart?: (e: React.MouseEvent, state: DragData) => void;
  onStop?: (e: MouseEvent, state: DragData) => void;
  onDrag?: (e: MouseEvent, state: DragData) => void;
  dragging: boolean;
};

export function makeDraggable<P>(
  Component: React.ComponentType<DraggableInnerProps<P>>
): React.ComponentType<DraggableProps<P>> {
  @observer
  class Draggable extends React.Component<DraggableProps<P>> {
    @observable
    lastX: number = 0;
    @observable
    lastY: number = 0;

    @observable
    x: number = 0;
    @observable
    y: number = 0;

    @observable
    deltaX: number = 0;
    @observable
    deltaY: number = 0;

    constructor(props: DraggableProps<P>) {
      super(props);
    }

    componentDidMount() {
      window.addEventListener("mouseup", this.mouseUpListener);
      window.addEventListener("mousemove", this.mouseMoveListener);
    }

    componentWillUnmount() {
      window.removeEventListener("mouseup", this.mouseUpListener);
      window.removeEventListener("mousemove", this.mouseMoveListener);
    }

    @action
    startDragging = (e: React.MouseEvent) => {
      e.stopPropagation();

      const x = e.clientX;
      const y = e.clientY;

      this.lastX = x;
      this.lastY = y;

      this.x = x;
      this.y = y;

      this.props.onStart && this.props.onStart(e, this);
    };

    mouseUpListener = (e: MouseEvent) => {
      e.stopPropagation();

      this.props.onStop && this.props.onStop(e, this);
    };

    mouseMoveListener = (e: MouseEvent) => {
      e.stopPropagation();

      console.log(this.props.dragging);
      if (!this.props.dragging) return;

      this.lastX = this.x;
      this.lastY = this.y;

      this.x = e.clientX;
      this.y = e.clientY;

      this.deltaX = this.x - this.lastX;
      this.deltaY = this.y - this.lastY;

      this.props.onDrag && this.props.onDrag(e, this);
    };

    render() {
      const { onStart, onStop, onDrag, ...rest } = this.props as any;
      return <Component startDragging={this.startDragging} {...rest} />;
    }
  }

  return Draggable;
}
