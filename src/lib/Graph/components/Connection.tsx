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

    stroke: "black",
    fill: "transparent"
  },

  mouseOver: {
    strokeDasharray: "20 2"
  }
};

@observer
export class Connection extends React.Component<ConnectionProps> {
  constructor(props: ConnectionProps) {
    super(props);

    this.setActiveStyle = throttle(this.setActiveStyle, 100);
  }

  @observable activeStyle: keyof typeof styles;

  @action
  setActiveStyle(activeStyle: keyof typeof styles) {
    this.activeStyle = activeStyle;
  }

  render() {
    const { connection, getPortBounds } = this.props;

    const combinedStyles = {
      ...styles.default,
      ...styles[this.activeStyle]
    };

    return (
      <FlexLine
        onMouseOver={() => this.setActiveStyle("mouseOver")}
        onMouseOut={() => this.setActiveStyle("default")}
        key={connection.id}
        a={getPortBounds(connection.source)}
        b={getPortBounds(connection.target)}
        {...combinedStyles}
      />
    );
  }
}
