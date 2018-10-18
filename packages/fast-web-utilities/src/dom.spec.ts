import { getKeyCode } from "./dom";
import { KeyCodes } from "./key-codes";

describe("getKeyCode", () => {
    test("should correctly handle null", () => {
        expect(getKeyCode(null)).toBe(null);
    });

    test("should correctly handle keyboard events with `keyCode` values", () => {
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    keyCode: 39
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowRight);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    keyCode: 37
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowLeft);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    keyCode: 38
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowUp);
        expect(
            getKeyCode(
                new KeyboardEvent("keydown", {
                    keyCode: 40
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowDown);
        expect(
            getKeyCode(
                new KeyboardEvent("keydown", {
                    keyCode: 13
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.enter);
        expect(
            getKeyCode(
                new KeyboardEvent("keydown", {
                    keyCode: 32
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.space);
        expect(
            getKeyCode(
                new KeyboardEvent("keydown", {
                    keyCode: 9
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.tab);
    });

    test("should correctly handle keyboard events with `which` values", () => {
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 39
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowRight);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 37
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowLeft);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 38
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowUp);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 40
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowDown);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 13
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.enter);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 32
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.space);
        expect(
            getKeyCode(new KeyboardEvent("keypress", { which: 9 } as KeyboardEventInit))
        ).toBe(KeyCodes.tab);
    });

    test("should correctly handle keyboard events with `charCode` values", () => {
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 39
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowRight);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 37
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowLeft);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 38
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowUp);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 40
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowDown);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 13
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.enter);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 32
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.space);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 9
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.tab);
    });
});
