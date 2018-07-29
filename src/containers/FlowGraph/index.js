import * as React from "react";
import { inject, observer } from "mobx-react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Sidebar } from "./Sidebar";
import { GraphWrapper } from "./GraphWrapper";

@inject("flowGraphStore")
@observer
export class FlowGraph extends React.Component {
  render() {
    return (
      <React.Fragment>
        <DragDropContextProvider backend={HTML5Backend}>
          <Sidebar />

          <GraphWrapper
            graphStore={this.props.flowGraphStore.graphStore}
            addNode={this.props.flowGraphStore.addNode}
          />
        </DragDropContextProvider>
      </React.Fragment>
    );
  }
}
