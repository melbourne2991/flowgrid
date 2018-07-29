import * as React from "react";
import { makeDraggable } from "./Draggable";
import { observer } from "mobx-react";

@makeDraggable(props => ({
  store: props.port.draggable,

  onStart: (e, data) => {
    e.stopPropagation();
    props.port.beginNewConnection();
  },

  onDrag: (e, data) => {
    props.port.updateNewConnection(data.deltaX, data.deltaY);
  },

  onStop: (e, data) => {
    props.port.cancelNewConnection();
  }
}))
@observer
export class PortWrapper extends React.Component {
  handleMouseUp = e => {
    this.props.port.handlePotentialConnection();
  };

  render() {
    return this.props.renderPort({
      port: this.props.port,
      handlers: {
        ...this.props.draggableHandlers,
        onMouseUp: this.handleMouseUp
      }
    });
  }
}
