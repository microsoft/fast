import { PointerGestureHandler } from "./";
import { PointerGesture } from "./pointer-gesture";

describe("PointerGestureHandler initilization", () => {
    const testElement: HTMLElement = document.createElement("div");
    const pointerGestureHandler = new PointerGestureHandler(testElement);

    test("should initiate sucessfully", () => {
        expect(pointerGestureHandler).toBeInstanceOf(PointerGestureHandler);
    });

    test("should initiate with no active pointers", () => {
        expect(pointerGestureHandler.pointers).toEqual(new Map());
    });
});

describe("onGesture", () => {
    test("should register a callback function", () => {
        expect(new PointerGestureHandler().onGesture(PointerGesture.Start, () => {})).toBeInstanceOf(Object);
    });
});