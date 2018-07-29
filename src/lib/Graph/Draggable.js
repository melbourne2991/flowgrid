import React from "react";
import { observer } from "mobx-react";

export const makeDraggable = propsMapper => Component => {
  @observer
  class Draggable extends React.Component {
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

    get store() {
      return propsMapper(this.props).store;
    }

    get onStart() {
      return propsMapper(this.props).onStart;
    }

    get onStop() {
      return propsMapper(this.props).onStop;
    }

    get onDrag() {
      return propsMapper(this.props).onDrag;
    }

    _onStart = e => {
      this.store.start(e.clientX, e.clientY);
      this.onStart && this.onStart(e);
    };

    _onDrag = e => {
      if (this.store.dragging) {
        const result = this.store.drag(e.clientX, e.clientY);
        this.onDrag && this.onDrag(e, result);
      }
    };

    _onStop = e => {
      if (this.store.dragging) {
        this.store.stop(e.clientX, e.clientY);
        this.onStop && this.onStop(e);
      }
    };

    render() {
      const { ...rest } = this.props;

      return (
        <Component
          {...rest}
          draggableHandlers={this.draggableHandlers}
          dragging={this.store.dragging}
        />
      );
    }
  }

  return Draggable;
};
