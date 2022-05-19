import { Point } from "../base/point.js";
import { PointerCoordinateType } from "../pointer-coordinate-type.js";

export function getPointerCoordinate(
    e: PointerEvent,
    coordinateType: PointerCoordinateType
): Point {
    switch (coordinateType) {
        case PointerCoordinateType.Client:
            return { x: e.clientX, y: e.clientY };

        case PointerCoordinateType.Offset:
            return { x: e.offsetX, y: e.offsetY };

        case PointerCoordinateType.Screen:
            return { x: e.screenX, y: e.screenY };

        case PointerCoordinateType.Page:
        default:
            return { x: e.pageX, y: e.pageY };
    }
}
