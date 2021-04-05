import {
    canUseCssGrid,
    canUseFocusVisible,
    canUseForcedColors,
    getDisplayedNodes,
    getKeyCode,
    isHTMLElement,
    resetDocumentCache,
} from "./dom";
import { KeyCodes } from "./key-codes";

describe("isHTMLElement", () => {
    document.body.innerHTML = `
        <div id="element">
            Child
        </div>
    `;

    test("should not throw", () => {
        expect(() => {
            isHTMLElement();
        }).not.toThrow();
    });
    test("should return true if all arguments are HTML elements", () => {
        expect(isHTMLElement(document.getElementById("element"))).toBe(true);
    });
    test("should return false if all arguments are NOT HTML elements", () => {
        expect(isHTMLElement(document.getElementById("element").childNodes)).toBe(false);
    });
});

describe("getDisplayedNodes", () => {
    test("should not throw if both arguments are null or undefined", () => {
        expect(() => {
            getDisplayedNodes(null, null);
            getDisplayedNodes(undefined, undefined);
        }).not.toThrow();
    });
});

describe("getKeyCode", () => {
    test("should correctly handle null", () => {
        expect(getKeyCode(null)).toBe(null);
    });

    test("should correctly handle keyboard events with `keyCode` values", () => {
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    keyCode: 39,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowRight);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    keyCode: 37,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowLeft);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    keyCode: 38,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowUp);
        expect(
            getKeyCode(
                new KeyboardEvent("keydown", {
                    keyCode: 40,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowDown);
        expect(
            getKeyCode(
                new KeyboardEvent("keydown", {
                    keyCode: 13,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.enter);
        expect(
            getKeyCode(
                new KeyboardEvent("keydown", {
                    keyCode: 32,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.space);
        expect(
            getKeyCode(
                new KeyboardEvent("keydown", {
                    keyCode: 9,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.tab);
    });

    test("should correctly handle keyboard events with `which` values", () => {
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 39,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowRight);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 37,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowLeft);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 38,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowUp);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 40,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowDown);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 13,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.enter);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    which: 32,
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
                    charCode: 39,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowRight);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 37,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowLeft);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 38,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowUp);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 40,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.arrowDown);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 13,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.enter);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 32,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.space);
        expect(
            getKeyCode(
                new KeyboardEvent("keypress", {
                    charCode: 9,
                } as KeyboardEventInit)
            )
        ).toBe(KeyCodes.tab);
    });
});

describe("canUseFocusVisible", () => {
    beforeEach(() => {
        resetDocumentCache();
    });
    test("should not throw", () => {
        expect(() => {
            canUseFocusVisible();
        }).not.toThrow();
    });
    test("should return true if the environment supports focus-visible selectors", () => {
        expect(canUseFocusVisible()).toBe(true);
    });
    test("should use a nonce if once is present on the page", () => {
        const nonce: string = "foo-nonce";
        const metaEl: HTMLMetaElement = document.createElement("meta");
        metaEl.setAttribute("property", "csp-nonce");
        metaEl.setAttribute("content", nonce);
        document.head.appendChild(metaEl);

        // Run the function and intercept its appendChild call
        const realAppendChild = document.head.appendChild;
        const mockAppendChild = jest.fn(realAppendChild);
        Object.defineProperty(document.head, "appendChild", {
            value: mockAppendChild,
            configurable: true,
        });
        canUseFocusVisible();

        expect(mockAppendChild).toBeCalledTimes(1);
        const createdStyleElement = mockAppendChild.mock.calls[0][0] as HTMLStyleElement;
        expect(createdStyleElement.nonce).toEqual(nonce);
        Object.defineProperty(document.head, "appendChild", {
            value: realAppendChild,
            configurable: true,
        });
    });
    test("should cache the result for subsequent calls", () => {
        const realAppendChild = document.head.appendChild;
        const mockAppendChild = jest.fn(realAppendChild);
        Object.defineProperty(document.head, "appendChild", {
            value: mockAppendChild,
            configurable: true,
        });
        canUseFocusVisible();

        expect(mockAppendChild).toBeCalledTimes(1);
        mockAppendChild.mockClear();

        canUseFocusVisible();
        expect(mockAppendChild).toBeCalledTimes(0);
        Object.defineProperty(document.head, "appendChild", {
            value: realAppendChild,
            configurable: true,
        });
    });
});

describe("canUseCssGrid", () => {
    beforeEach(() => {
        resetDocumentCache();
    });
    test("should not throw", () => {
        expect(() => {
            canUseCssGrid();
        }).not.toThrow();
    });
});

describe("canUseForcedColors", () => {
    beforeEach(() => {
        window.matchMedia = jest.fn().mockImplementation((query: any) => {
            return {
                matches: true,
                media: query,
            };
        });
    });
    test("should return true if forced color is enabled", () => {
        expect(canUseForcedColors()).toBe(true);
    });
});

describe("canUseForcedColors", () => {
    beforeEach(() => {
        window.matchMedia = jest.fn().mockImplementation((query: any) => {
            return {
                matches: false,
                media: query,
            };
        });
    });
    test("should return false if forced color is not enabled", () => {
        expect(canUseForcedColors()).toBe(false);
    });
});
