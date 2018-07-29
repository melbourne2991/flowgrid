import * as React from "react";

export class CubicBezier extends React.PureComponent {
  render() {
    const { a, b, CPA, CPB } = this.props;

    const d =
      `M${a.x},${a.y} ` +
      `C${CPA.x},${CPA.y} ` +
      `${CPB.x},${CPB.y} ` +
      `${b.x},${b.y}`;

    return <path d={d} stroke="black" fill="transparent" />;
  }
}

export class FlexLine extends React.PureComponent {
  calculateCurve() {
    const { a, b } = this.props;

    const aIsSnapbox = isSnapbox(a);
    const bIsSnapbox = isSnapbox(b);

    const pointA = aIsSnapbox ? a.position : a;
    const pointB = bIsSnapbox ? b.position : b;

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
      const extentsA = a.extents;
      finalPosAX = pointA.x + extentsA * posSideX;
      finalPosAY = pointA.y + extentsA * posSideY;
    } else {
      finalPosAX = pointA.x;
      finalPosAY = pointA.y;
    }

    if (bIsSnapbox) {
      const extentsB = b.extents;
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

  render() {
    return <CubicBezier {...this.calculateCurve()} />;
  }
}

function difference(b, a) {
  const x = b.x - a.x;
  const y = b.y - a.y;

  return {
    x,
    y
  };
}

export function isSnapbox(obj) {
  return obj.extents !== undefined && obj.position !== undefined;
}
