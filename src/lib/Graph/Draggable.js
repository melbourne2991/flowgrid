import React from "react";
import { observer } from "mobx-react";

@observer
export class Draggable extends React.Component {
  constructor(props) {
    super(props);

    this.draggableHandlers = {
      onMouseDown: this._onStart
    };
  }

  componentDidMount() {
    this.mouseUpListener = e => {
      this._onStop(e);
    };

    this.mouseMoveListener = e => {
      this._onDrag(e);
    };

    window.addEventListener("mouseup", this.mouseUpListener);
    window.addEventListener("mousemove", this.mouseMoveListener);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.mouseUpListener);
    window.removeEventListener("mousemove", this.mouseMoveListener);
  }

  _onStart = e => {
    this.props.store.start(e.clientX, e.clientY);
    this.props.onStart && this.props.onStart(e);
  };

  _onDrag = e => {
    if (this.props.store.dragging) {
      const result = this.props.store.drag(e.clientX, e.clientY);
      this.props.onDrag && this.props.onDrag(e, result);
    }
  };

  _onStop = e => {
    if (this.props.store.dragging) {
      this.props.store.stop(e.clientX, e.clientY);
      this.props.onStop && this.props.onStop(e);
    }
  };

  render() {
    const { onStart, onStop, onDrag, store, render, ...rest } = this.props;

    return this.props.render({
      draggableHandlers: this.draggableHandlers,
      ...rest
    });
  }
}
