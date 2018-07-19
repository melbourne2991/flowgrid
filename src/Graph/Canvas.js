import React from "react";
import { css } from "emotion";
import { mapProps } from "recompose";
import { Draggable } from "./Draggable";
import { observer } from "mobx-react";

const CanvasWindowEl = mapProps(({ width, height, ...rest }) => ({
  className: css({
    margin: "0 auto",
    width: `${width}px`,
    height: `${height}px`,
    border: "1px solid #000",
    overflow: "hidden"
  }),
  ...rest
}))("div");

const CanvasEl = mapProps(({ width, height, scale, translate, ...rest }) => ({
  style: {
    transform:
      `translate(${translate.x * 100}%, ${translate.y * 100}%)` +
      `scale(${scale})`
  },
  className: css({
    width: `${width}px`,
    height: `${height}px`,
    background: "#ccc",
    position: "relative",
    overflow: "hidden",
    transformOrigin: "50% 50%",
    transition: "0.05s ease"
  }),
  ...rest
}))("div");

const draggableStore = Draggable.CreateStore();

export const Canvas = observer(
  ({
    canvas,
    canvasWindow,
    renderSvg,
    renderNodes,
    onDrag,
    onWheel,
    onMouseMove
  }) => {
    const canvasCenter = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };

    return (
      <CanvasWindowEl
        {...canvasWindow}
        onWheel={onWheel}
        onMouseMove={onMouseMove}
      >
        <Draggable onDrag={onDrag} store={draggableStore}>
          <CanvasEl {...canvas}>
            <svg
              width={canvas.width}
              height={canvas.height}
              viewBox={`0 0 ${canvas.width} ${canvas.height}`}
              xmlns="http://www.w3.org/2000/svg"
              className={css({ position: "absolute", left: 0, top: 0 })}
              children={renderSvg({ canvasCenter })}
            />

            <div
              className={css({
                position: "absolute"
              })}
              children={renderNodes({ canvasCenter })}
            />
          </CanvasEl>
        </Draggable>
      </CanvasWindowEl>
    );
  }
);
