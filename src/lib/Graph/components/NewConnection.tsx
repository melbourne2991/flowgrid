import * as React from "react";
import { observer } from "mobx-react";
import { GraphStore } from "../GraphStore";
import { FlexLine } from "./FlexLine";

const mouseOffset = 3;

export const NewConnection = observer((props: { store: GraphStore }) => {
  const { newConnection } = props.store.graph;
  if (!newConnection || !newConnection.position) return null;

  const bounds = props.store.getPortBounds(newConnection.source);

  const style = {
    strokeWidth: "4",
    stroke: "black",
    fill: "transparent"
  };

  return (
    <FlexLine
      {...style}
      key={newConnection.id}
      a={bounds}
      b={{
        x:
          newConnection.position.x -
          mouseOffset * Math.sign(newConnection.position.x),
        y:
          newConnection.position.y -
          mouseOffset * Math.sign(newConnection.position.y)
      }}
    />
  );
});
