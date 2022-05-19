import { PointerGesture } from "./pointer-gesture.js";
import { PointerGestureHandler } from "./pointer-gesture-handler.js";

describe("PointerGestureHandler", () => {
    document.body.innerHTML = "<div id='container'>" + "  <div id='child' />" + "</div>";

    const containerElement: HTMLElement = document.getElementById("container")!;
    const childElement: HTMLElement = document.getElementById("child")!;
    const pointerGestureHandler = new PointerGestureHandler(childElement, {
        isHoverEnabled: true,
    });

    test("should initiate sucessfully", () => {
        expect(pointerGestureHandler).toBeInstanceOf(PointerGestureHandler);
    });

    test("should initiate with no active pointers", () => {
        expect(pointerGestureHandler.pointers).toEqual(new Map());
        expect(pointerGestureHandler.pointersArray).toEqual([]);
    });

    test("should set target as child", () => {
        expect(pointerGestureHandler.target).toEqual(childElement);
    });

    test("should set target as container", () => {
        pointerGestureHandler.target = containerElement;
        expect(pointerGestureHandler.target).toEqual(containerElement);
    });

    const onGestureStart = pointerGestureHandler.onGesture(PointerGesture.Start, () => {
        //
    });

    test("should register a callback function", () => {
        expect(onGestureStart).toBeInstanceOf(Object);
    });
});
