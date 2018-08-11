import { Point } from "./types";

export function pointDistance(pointA: Point, pointB: Point) {
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
  );
}