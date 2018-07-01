import { getKeyCode, isDescendant } from "./dom";
import { KeyCodes } from "./key-codes";

describe("isDescendant", () => {
    let parent: HTMLElement;
    let child: HTMLElement;
    let nestedChild: HTMLElement;
    let sibling: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="parent">
                <span id="child">
                    <span id="nestedChild"></span>
                </span>
            </div>
            <div id="sibling"></div>
        `;

        parent = document.getElementById("parent");
        child = document.getElementById("child");
        nestedChild = document.getElementById("nestedChild");
        sibling = document.getElementById("sibling");
    });

    test("should correctly handle undefined values for parent or child params", () => {
        expect(() => isDescendant(undefined, undefined)).not.toThrow();
        expect(() => isDescendant(parent, undefined)).not.toThrow();
        expect(() => isDescendant(undefined, child)).not.toThrow();
    });

    test("should return true when an element is a descendant of parent element", () => {
        expect(isDescendant(parent, child)).toBe(true);
    });

    test("should return true when an child is a deeply nested descendant of an element", () => {
        expect(isDescendant(parent, child)).toBe(true);
    });

    test("should return false when an child is not a descendant of an element", () => {
        expect(isDescendant(parent, sibling)).toBe(false);
        expect(isDescendant(child, parent)).toBe(false);
    });
});

describe("getKeyCode", () => {
    test("should correctly handle null", () => {
        expect(getKeyCode(null)).toBe(null);
    });

    test("should correctly handle keyboard events with `keyCode` values", () => {
        expect(getKeyCode(new KeyboardEvent("keypress", {keyCode: 39} as KeyboardEventInit))).toBe(KeyCodes.arrowRight);
        expect(getKeyCode(new KeyboardEvent("keypress", {keyCode: 37} as KeyboardEventInit))).toBe(KeyCodes.arrowLeft);
        expect(getKeyCode(new KeyboardEvent("keypress", {keyCode: 38} as KeyboardEventInit))).toBe(KeyCodes.arrowUp);
        expect(getKeyCode(new KeyboardEvent("keydown", {keyCode: 40} as KeyboardEventInit))).toBe(KeyCodes.arrowDown);
        expect(getKeyCode(new KeyboardEvent("keydown", {keyCode: 13} as KeyboardEventInit))).toBe(KeyCodes.enter);
        expect(getKeyCode(new KeyboardEvent("keydown", {keyCode: 32} as KeyboardEventInit))).toBe(KeyCodes.space);
        expect(getKeyCode(new KeyboardEvent("keydown", {keyCode: 9} as KeyboardEventInit))).toBe(KeyCodes.tab);
    });

    test("should correctly handle keyboard events with `which` values", () => {
        expect(getKeyCode(new KeyboardEvent("keypress", {which: 39} as KeyboardEventInit))).toBe(KeyCodes.arrowRight);
        expect(getKeyCode(new KeyboardEvent("keypress", {which: 37} as KeyboardEventInit))).toBe(KeyCodes.arrowLeft);
        expect(getKeyCode(new KeyboardEvent("keypress", {which: 38} as KeyboardEventInit))).toBe(KeyCodes.arrowUp);
        expect(getKeyCode(new KeyboardEvent("keypress", {which: 40} as KeyboardEventInit))).toBe(KeyCodes.arrowDown);
        expect(getKeyCode(new KeyboardEvent("keypress", {which: 13} as KeyboardEventInit))).toBe(KeyCodes.enter);
        expect(getKeyCode(new KeyboardEvent("keypress", {which: 32} as KeyboardEventInit))).toBe(KeyCodes.space);
        expect(getKeyCode(new KeyboardEvent("keypress", {which: 9} as KeyboardEventInit))).toBe(KeyCodes.tab);
    });

    test("should correctly handle keyboard events with `charCode` values", () => {
        expect(getKeyCode(new KeyboardEvent("keypress", {charCode: 39} as KeyboardEventInit))).toBe(KeyCodes.arrowRight);
        expect(getKeyCode(new KeyboardEvent("keypress", {charCode: 37} as KeyboardEventInit))).toBe(KeyCodes.arrowLeft);
        expect(getKeyCode(new KeyboardEvent("keypress", {charCode: 38} as KeyboardEventInit))).toBe(KeyCodes.arrowUp);
        expect(getKeyCode(new KeyboardEvent("keypress", {charCode: 40} as KeyboardEventInit))).toBe(KeyCodes.arrowDown);
        expect(getKeyCode(new KeyboardEvent("keypress", {charCode: 13} as KeyboardEventInit))).toBe(KeyCodes.enter);
        expect(getKeyCode(new KeyboardEvent("keypress", {charCode: 32} as KeyboardEventInit))).toBe(KeyCodes.space);
        expect(getKeyCode(new KeyboardEvent("keypress", {charCode: 9} as KeyboardEventInit))).toBe(KeyCodes.tab);
    });
});
