import { convertStylePropertyPixelsToNumber, getClientRectWithMargin } from "./html";

describe("getClientRectWithMargin", () => {
    const mockWidth: number = 120;
    const mockHeight: number = 120;
    const mockRect: ClientRect | DOMRect = {
        width: mockWidth,
        height: mockHeight,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    };

    beforeEach(() => {
        Element.prototype.getBoundingClientRect = jest.fn(() => {
            return mockRect;
        });
    });

    test("should correctly manage undefined and null values", () => {
        expect(() => getClientRectWithMargin(null)).not.toThrow();
        expect(() => getClientRectWithMargin(undefined)).not.toThrow();
    });

    test("should correctly return computed client rect with margin values", () => {
        document.body.innerHTML = `
            <div id="element" style="margin: 10px 20px;"></div>
        `;

        const element: HTMLElement = document.getElementById("element");
        const expectedWidth: number = mockWidth + 40;
        const expectedHeight: number = mockHeight + 20;

        const expectedRect: ClientRect | DOMRect = Object.assign({}, mockRect, { width: expectedWidth, height: expectedHeight});

        expect(getClientRectWithMargin(element)).toEqual(expectedRect);
    });
});

describe("convertStylePropertyPixelsToNumber", () => {
    test("should correctly manage undefined and null values", () => {
        expect(() => convertStylePropertyPixelsToNumber(null, null)).not.toThrow();
        expect(() => convertStylePropertyPixelsToNumber(undefined, null)).not.toThrow();
        expect(() => convertStylePropertyPixelsToNumber(undefined, undefined)).not.toThrow();
    });

    test("should correctly convert a elements computed style property pixel value and return a number", () => {
        document.body.innerHTML = `
            <div id="element" style="margin: 20px 5px 12px 8px;"></div>
        `;

        const element: HTMLElement = document.getElementById("element");

        expect(convertStylePropertyPixelsToNumber(window.getComputedStyle(element), "margin-top")).toBe(20);
        expect(convertStylePropertyPixelsToNumber(window.getComputedStyle(element), "margin-bottom")).toBe(12);
        expect(convertStylePropertyPixelsToNumber(window.getComputedStyle(element), "margin-left")).toBe(8);
        expect(convertStylePropertyPixelsToNumber(window.getComputedStyle(element), "margin-right")).toBe(5);
    });
});
