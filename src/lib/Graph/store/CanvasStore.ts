import { observable } from "mobx";

export class CanvasStore {
  canvasWidth: number;
  canvasHeight: number;
  canvasWindowWidth: number;
  canvasWindowHeight: number;
  canvasCenterX: number;
  canvasCenterY: number;

  SVGPoint = null;

  @observable translate;
  @observable scale = 1;

  // Had to introduce this as a means
  // of getting panning to play nicely with dragging
  // elements around - stopPropagation / stopImmediatePop
  // was not working.
  locked = false;

  CTM: any = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };

  constructor({
    canvasWidth,
    canvasHeight,
    canvasWindowWidth,
    canvasWindowHeight
  }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvasWindowWidth = canvasWindowWidth;
    this.canvasWindowHeight = canvasWindowHeight;

    this.canvasCenterX = this.canvasWidth / 2;
    this.canvasCenterY = this.canvasHeight / 2;
  }

  clientToSVGPoint(clientX, clientY) {
    this.SVGPoint.x = clientX;
    this.SVGPoint.y = clientY;

    return this.SVGPoint.matrixTransform(this.CTM.inverse());
  }
}
