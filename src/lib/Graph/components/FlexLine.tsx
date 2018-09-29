import * as React from "react";
import { Point } from "../types";

export interface CubicBezierProps extends React.SVGProps<SVGPathElement> {
  a: Point;
  b: Point;
  CPA: Point;
  CPB: Point;
}

export class CubicBezier extends React.PureComponent<CubicBezierProps> {
  render() {
    const { a, b, CPA, CPB, ...rest } = this.props;

    const d =
      `M${a.x},${a.y} ` +
      `C${CPA.x},${CPA.y} ` +
      `${CPB.x},${CPB.y} ` +
      `${b.x},${b.y}`;

    return <path d={d} {...rest} />;
  }
}

export interface PositionWithExtents {
  position: Point;
  extents: number;
}

export interface FlexLineProps extends React.SVGProps<SVGPathElement> {
  a: Point | PositionWithExtents;
  b: Point | PositionWithExtents;
}

export class FlexLine extends React.PureComponent<FlexLineProps> {
  render() {
    const { a, b, ...rest } = this.props;

    return <CubicBezier {...this.calculateCurve()} {...rest as any} />;
  }

  calculateCurve() {
    const { a, b } = this.props;

    const aIsSnapbox = hasPositionAndExtents(a);
    const bIsSnapbox = hasPositionAndExtents(b);

    const pointA = aIsSnapbox
      ? (a as PositionWithExtents).position
      : (a as Point);
    const pointB = bIsSnapbox
      ? (b as PositionWithExtents).position
      : (b as Point);

    const diff = difference(pointB, pointA);

    const diffX = diff.x;
    const diffY = diff.y;

    const xDirection = Math.sign(diffX);
    const yDirection = Math.sign(diffY);

    const totalDiff = diffX + diffY;

    const relativeDiffX = diffX / totalDiff;
    const relativeDiffY = diffY / totalDiff;

    let posSideX, posSideY;

    if (relativeDiffX > relativeDiffY) {
      posSideX = xDirection;
      posSideY = 0;
    } else {
      posSideY = yDirection;
      posSideX = 0;
    }

    let finalPosAX, finalPosAY, finalPosBX, finalPosBY;

    if (aIsSnapbox) {
      const extentsA = (a as PositionWithExtents).extents;
      finalPosAX = pointA.x + extentsA * posSideX;
      finalPosAY = pointA.y + extentsA * posSideY;
    } else {
      finalPosAX = pointA.x;
      finalPosAY = pointA.y;
    }

    if (bIsSnapbox) {
      const extentsB = (b as PositionWithExtents).extents;
      finalPosBX = pointB.x + extentsB * -posSideX;
      finalPosBY = pointB.y + extentsB * -posSideY;
    } else {
      finalPosBX = pointB.x;
      finalPosBY = pointB.y;
    }

    const multiplier = 0.3;

    const cpAX = finalPosAX + posSideX * (multiplier * Math.abs(diffX));
    const cpAY = finalPosAY + posSideY * (multiplier * Math.abs(diffY));

    const cpBX = finalPosBX - posSideX * (multiplier * Math.abs(diffX));
    const cpBY = finalPosBY - posSideY * (multiplier * Math.abs(diffY));

    const curve = {
      a: {
        x: finalPosAX,
        y: finalPosAY
      },

      b: {
        x: finalPosBX,
        y: finalPosBY
      },

      CPA: {
        x: cpAX,
        y: cpAY
      },

      CPB: {
        x: cpBX,
        y: cpBY
      }
    };

    return curve;
  }
}

function difference(b: Point, a: Point) {
  const x = b.x - a.x;
  const y = b.y - a.y;

  return {
    x,
    y
  };
}

export function hasPositionAndExtents(obj: any) {
  return obj.extents !== undefined && obj.position !== undefined;
}
