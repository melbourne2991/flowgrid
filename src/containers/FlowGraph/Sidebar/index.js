import * as React from "react";
import { observer, inject } from "mobx-react";
import { withStyles } from "@material-ui/core";
import { NodeType } from "../NodeType";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import InfoIcon from "@material-ui/icons/Info";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import * as mixins from "../../../style/mixins";

@withStyles(theme => ({
  sidebarWrapper: {
    ...mixins.boxSpacing(theme),
    display: "flex",
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    maxWidth: `${theme.spacing.unit * 60}px`
  },

  sidebar: {
    ...theme.mixins.gutters(),
    paddingTop: `${theme.spacing.unit}px`,
    paddingBottom: `${theme.spacing.unit * 2}px`,
    flex: 1
  },

  sidebarContent: {
    paddingTop: `${theme.spacing.unit * 2}px`
  }
}))
@inject("flowGraphStore")
@observer
export class Sidebar extends React.Component {
  renderNodeTypes() {
    const { flowGraphStore } = this.props;

    const nodes = flowGraphStore.nodeTypes.map(nodeType => (
      <NodeType key={nodeType.config.name} nodeType={nodeType} />
    ));

    return <React.Fragment>{nodes}</React.Fragment>;
  }

  renderNodeInfo() {
    const { flowGraphStore } = this.props;

    if (flowGraphStore.selectedNode) {
      return (
        <React.Fragment>
          {flowGraphStore.selectedNode.nodeType.config.name}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Typography>Select a node to see more information about it</Typography>
      </React.Fragment>
    );
  }

  updateTab = (e, tab) => {
    const { flowGraphStore } = this.props;
    flowGraphStore.sidebar.activeTab = tab;
  };

  render() {
    const { flowGraphStore, classes } = this.props;

    return (
      <div className={classes.sidebarWrapper}>
        <Paper className={classes.sidebar} elevation={1}>
          <Tabs
            value={flowGraphStore.sidebar.activeTab}
            onChange={this.updateTab}
            fullWidth
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<InfoIcon />} />
            <Tab icon={<LibraryAddIcon />} />
          </Tabs>

          <div className={classes.sidebarContent}>
            {flowGraphStore.sidebar.activeTab === 0 && this.renderNodeInfo()}
            {flowGraphStore.sidebar.activeTab === 1 && this.renderNodeTypes()}
          </div>
        </Paper>
      </div>
    );
  }
}
