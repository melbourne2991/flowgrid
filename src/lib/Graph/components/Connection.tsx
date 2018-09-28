import * as React from "react";
import { IGraphConnection, GetPortBoundsFn } from "../types";
import { FlexLine } from "./FlexLine";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import throttle = require("lodash/throttle");

export interface ConnectionProps {
  connection: IGraphConnection;
  getPortBounds: GetPortBoundsFn;
}

const styles = {
  default: {
    strokeWidth: "4",
    stroke: "#eef0ff",
    fill: "transparent"
  },

  mouseOver: {
    strokeWidth: "6",
    stroke: "#3f51b5"
  },

  selected: {
    stroke: "#3f51b5"
  }
};

@observer
export class Connection extends React.Component<ConnectionProps> {
  constructor(props: ConnectionProps) {
    super(props);

    this.setActiveStyle = throttle(this.setActiveStyle, 100);
  }

  @observable
  activeStyle: keyof typeof styles;

  @action
  setActiveStyle(activeStyle: keyof typeof styles) {
    this.activeStyle = activeStyle;
  }

  render() {
    const { connection, getPortBounds } = this.props;

    let activeStyle = this.activeStyle;

    // override others with selected
    if (connection.selected) {
      activeStyle = "selected";
    }

    const combinedStyles = {
      ...styles.default,
      ...styles[activeStyle]
    };

    return (
      <React.Fragment>
        <FlexLine
          onMouseDown={() => connection.select()}
          onMouseOver={() => this.setActiveStyle("mouseOver")}
          onMouseOut={() => this.setActiveStyle("default")}
          key={connection.id}
          a={getPortBounds(connection.source)}
          b={getPortBounds(connection.target)}
          {...combinedStyles}
        />
      </React.Fragment>
    );
  }
}
