import { PointerCoordinateType } from "../pointer-coordinate-type";
import { getCoordinateType } from "./get-coordinate-type";

describe("getCoordinateType", () => {
    test("should return client coordinate", () => {
        const mockPointerEvent = { clientX: 1, clientY: 2 };
        expect(getCoordinateType(mockPointerEvent as PointerEvent, PointerCoordinateType.Client)).toStrictEqual({ x: 1, y: 2 });
    });

    test("should return offset coordinate", () => {
        const mockPointerEvent = { offsetX: 1, offsetY: 2 };
        expect(getCoordinateType(mockPointerEvent as PointerEvent, PointerCoordinateType.Offset)).toStrictEqual({ x: 1, y: 2 });
    });

    test("should return screen coordinate", () => {
        const mockPointerEvent = { screenX: 1, screenY: 2 };
        expect(getCoordinateType(mockPointerEvent as PointerEvent, PointerCoordinateType.Screen)).toStrictEqual({ x: 1, y: 2 });
    });

    test("should return page coordinate", () => {
        const mockPointerEvent = { pageX: 1, pageY: 2 };
        expect(getCoordinateType(mockPointerEvent as PointerEvent, PointerCoordinateType.Page)).toStrictEqual({ x: 1, y: 2 });
    });
});