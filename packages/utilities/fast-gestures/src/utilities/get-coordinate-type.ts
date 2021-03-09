import { IPoint } from "../base/point";
import { PointerCoordinateType } from "../pointer-coordinate-type";

export function getCoordinateType(e: PointerEvent, coordinateType: PointerCoordinateType): IPoint {
  switch (coordinateType) {
    case PointerCoordinateType.Client:
      return { x: e.clientX, y: e.clientY };

    case PointerCoordinateType.Page:
      return { x: e.pageX, y: e.pageY };

    case PointerCoordinateType.Offset:
      return { x: e.offsetX, y: e.offsetY };

    case PointerCoordinateType.Screen:
      return { x: e.screenX, y: e.screenY };

    default:
      return { x: e.pageX, y: e.pageY };
  }
}