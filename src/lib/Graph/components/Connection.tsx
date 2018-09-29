import * as React from "react";
import { IGraphConnection, GetPortBoundsFn } from "../types";
import { FlexLine } from "./FlexLine";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import throttle = require("lodash/throttle");
import { GraphStore } from "../GraphStore";

export interface ConnectionProps {
  connection: IGraphConnection;
  getPortBounds: GetPortBoundsFn;
}

export type ConnectionInternalProps = {
  graphStore: GraphStore;
} & ConnectionProps;

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
class ConnectionComponent extends React.Component<ConnectionInternalProps> {
  constructor(props: ConnectionInternalProps) {
    super(props);

    this.setActiveStyle = throttle(this.setActiveStyle, 100);
  }

  @observable
  activeStyle: keyof typeof styles;

  @action
  setActiveStyle(activeStyle: keyof typeof styles) {
    this.activeStyle = activeStyle;
  }

  onSelect = () => {
    this.props.graphStore.engine.handleSelectConnection(this.props.connection);
  };

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
          onMouseDown={this.onSelect}
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

export const Connection = inject("graphStore")(
  ConnectionComponent
) as React.ComponentType<ConnectionProps>;
