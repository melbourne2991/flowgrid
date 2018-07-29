import React from "react";
import { observer } from "mobx-react";

export const makeSelectable = propsMapper => Component => {
  @observer
  class Selectable extends React.Component {
    constructor(props) {
      super(props);

      this.selectableHandlers = {
        onMouseDown: this._onSelect
      };
    }

    get store() {
      return propsMapper(this.props).store;
    }

    _onSelect = e => {
      e.stopPropagation();
      this.store.select();
    };

    render() {
      const { ...rest } = this.props;
      return (
        <Component
          {...rest}
          selectableHandlers={this.selectableHandlers}
          selected={this.store.selected}
        />
      );
    }
  }

  return Selectable;
};
