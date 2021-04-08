import { PointerGesture } from "../pointer-gesture";
import { getSwipeDirection } from "./get-swipe-direction";

describe("getSwipeDirection", () => {
    test("should return up swipe direction", () => {
        expect(getSwipeDirection(PointerGesture.PanUp)).toBe(PointerGesture.SwipeUp);
    });

    test("should return down swipe direction", () => {
        expect(getSwipeDirection(PointerGesture.PanDown)).toBe(PointerGesture.SwipeDown);
    });

    test("should return left swipe direction", () => {
        expect(getSwipeDirection(PointerGesture.PanLeft)).toBe(PointerGesture.SwipeLeft);
    });

    test("should return right swipe direction", () => {
        expect(getSwipeDirection(PointerGesture.PanRight)).toBe(PointerGesture.SwipeRight);
    });

    test("should return up-left swipe direction", () => {
        expect(getSwipeDirection(PointerGesture.PanUpLeft)).toBe(PointerGesture.SwipeUpLeft);
    });

    test("should return up-right swipe direction", () => {
        expect(getSwipeDirection(PointerGesture.PanUpRight)).toBe(PointerGesture.SwipeUpRight);
    });

    test("should return down-left swipe direction", () => {
        expect(getSwipeDirection(PointerGesture.PanDownLeft)).toBe(PointerGesture.SwipeDownLeft);
    });

    test("should return down-right swipe direction", () => {
        expect(getSwipeDirection(PointerGesture.PanDownRight)).toBe(PointerGesture.SwipeDownRight);
    });
});