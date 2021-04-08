import { PointerGesture } from "../pointer-gesture";
import { PointerTranslationDirection } from "../pointer-translation-direction";
import { detectPointerGesture } from "./detect-pointer-gesture";

describe("detectPointerGesture", () => {
    test("should detect right pan direction", () => {
        expect(detectPointerGesture(10, 0, PointerTranslationDirection.Cardinal)).toBe(PointerGesture.PanRight);
    });

    test("should detect up pan direction", () => {
        expect(detectPointerGesture(0, -10, PointerTranslationDirection.Cardinal)).toBe(PointerGesture.PanUp);
    });

    test("should detect left pan direction", () => {
        expect(detectPointerGesture(-10, 0, PointerTranslationDirection.Cardinal)).toBe(PointerGesture.PanLeft);
    });

    test("should detect down pan direction", () => {
        expect(detectPointerGesture(0, 10, PointerTranslationDirection.Cardinal)).toBe(PointerGesture.PanDown);
    });

    test("should detect down-right pan direction", () => {
        expect(detectPointerGesture(10, 10, PointerTranslationDirection.Ordinal)).toBe(PointerGesture.PanDownRight);
    });

    test("should detect right pan direction", () => {
        expect(detectPointerGesture(10, 0, PointerTranslationDirection.Ordinal)).toBe(PointerGesture.PanRight);
    });

    test("should detect up-right pan direction", () => {
        expect(detectPointerGesture(10, -10, PointerTranslationDirection.Ordinal)).toBe(PointerGesture.PanUpRight);
    });

    test("should detect up pan direction", () => {
        expect(detectPointerGesture(0, -10, PointerTranslationDirection.Ordinal)).toBe(PointerGesture.PanUp);
    });

    test("should detect up-left pan direction", () => {
        expect(detectPointerGesture(-10, -10, PointerTranslationDirection.Ordinal)).toBe(PointerGesture.PanUpLeft);
    });

    test("should detect left pan direction", () => {
        expect(detectPointerGesture(-10, 0, PointerTranslationDirection.Ordinal)).toBe(PointerGesture.PanLeft);
    });

    test("should detect down-left pan direction", () => {
        expect(detectPointerGesture(-10, 10, PointerTranslationDirection.Ordinal)).toBe(PointerGesture.PanDownLeft);
    });

    test("should detect down pan direction", () => {
        expect(detectPointerGesture(0, 10, PointerTranslationDirection.Ordinal)).toBe(PointerGesture.PanDown);
    });

    test("should detect up pan direction", () => {
        expect(detectPointerGesture(10, -10, PointerTranslationDirection.Vertical)).toBe(PointerGesture.PanUp);
    });

    test("should detect down pan direction", () => {
        expect(detectPointerGesture(10, 10, PointerTranslationDirection.Vertical)).toBe(PointerGesture.PanDown);
    });

    test("should detect right pan direction", () => {
        expect(detectPointerGesture(10, -10, PointerTranslationDirection.Horizontal)).toBe(PointerGesture.PanRight);
    });

    test("should detect left pan direction", () => {
        expect(detectPointerGesture(-10, -10, PointerTranslationDirection.Horizontal)).toBe(PointerGesture.PanLeft);
    });
});