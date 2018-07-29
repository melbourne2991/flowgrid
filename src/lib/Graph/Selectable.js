import React from "react";
import { observer } from "mobx-react";

export const makeSelectable = propsMapper => Component => {
  @observer
  class Selectable extends React.Component {
    constructor(props) {
      super(props);

      this.ref = React.createRef();

      this.selectableHandlers = {
        onMouseDown: this._onSelect,
        ref: this.ref
      };
    }

    get store() {
      return propsMapper(this.props).store;
    }

    componentDidMount() {
      window.addEventListener("mousedown", e => {
        if (!this.ref.current.contains(e.target)) {
          this.store.deselect();
        }
      });
    }

    componentWillUnmount() {}

    _onSelect = () => {
      this.store.select();
    };

    render() {
      const { ...rest } = this.props;
      return (
        <Component
          selectableHandlers={this.selectableHandlers}
          selected={this.store.selected}
          {...rest}
        />
      );
    }
  }

  return Selectable;
};
