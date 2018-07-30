import { observable } from "mobx";

export class CanvasStore {
  SVGPoint = null;

  svgEl: SVGElement;

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

  constructor() {}

  clientToSVGPoint(clientX, clientY) {
    // Find out where SVG is on the page.
    const { top, left } = this.svgEl.getBoundingClientRect();

    this.SVGPoint.x = clientX - left;
    this.SVGPoint.y = clientY - top;

    return this.SVGPoint.matrixTransform(this.CTM.inverse());
  }
}
