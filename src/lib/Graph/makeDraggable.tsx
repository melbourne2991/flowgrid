import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

export type DraggableProps<P = {}> = P & {
  dragging: boolean;
  startDragging(e: React.MouseEvent<any>): void;
};

export interface DraggableOptions {
  onStart?: (e: React.MouseEvent, state: { x: number; y: number }) => void;
  onStop?: (e: MouseEvent, state: { x: number; y: number }) => void;
  onDrag?: (
    e: MouseEvent,
    state: { x: number; y: number; deltaX: number; deltaY: number }
  ) => void;
}

export type DraggableComponentProps = DraggableOptions & {
  children: (props: DraggableProps) => React.ReactNode;
};

@observer
export class Draggable extends React.Component<DraggableComponentProps> {
  @observable dragging: boolean = false;

  @observable lastX: number = 0;
  @observable lastY: number = 0;

  @observable x: number = 0;
  @observable y: number = 0;

  @observable deltaX: number = 0;
  @observable deltaY: number = 0;

  constructor(props: DraggableComponentProps) {
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
    console.log("dragging!!");
    this.dragging = true;

    const x = e.clientX;
    const y = e.clientY;

    this.lastX = x;
    this.lastY = y;

    this.x = x;
    this.y = y;

    this.props.onStart && this.props.onStart(e, this);
  };

  mouseUpListener = (e: MouseEvent) => {
    this.dragging = false;
    this.props.onStop && this.props.onStop(e, this);
  };

  mouseMoveListener = (e: MouseEvent) => {
    if (!this.dragging) return;

    this.lastX = this.x;
    this.lastY = this.y;

    this.x = e.clientX;
    this.y = e.clientY;

    this.deltaX = this.x - this.lastX;
    this.deltaY = this.y - this.lastY;

    this.props.onDrag && this.props.onDrag(e, this);
  };

  render() {
    return this.props.children(this);
  }
}
