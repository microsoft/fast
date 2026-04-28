import { expect } from "chai";
import { convertStylePropertyPixelsToNumber, getClientRectWithMargin } from "./html.js";

describe("getClientRectWithMargin", () => {
    const mockWidth: number = 120;
    const mockHeight: number = 120;
    const mockRect: DOMRect = {
        width: mockWidth,
        height: mockHeight,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: undefined!,
        y: undefined!,
        toJSON: undefined!,
    };

    beforeEach(() => {
        Element.prototype.getBoundingClientRect = (): any => {
            return mockRect;
        };
    });

    it("should correctly manage undefined and null values", () => {
        expect(() => getClientRectWithMargin(null)).not.to.throw();
        expect(() => getClientRectWithMargin(undefined)).not.to.throw();
    });

    it("should correctly return computed client rect with margin values", () => {
        document.body.innerHTML = `
            <div id="element" style="margin: 10px 20px;"></div>
        `;

        const element: HTMLElement | undefined | null =
            document.getElementById("element");
        const expectedWidth: number = mockWidth + 40;
        const expectedHeight: number = mockHeight + 20;

        const expectedRect: DOMRect = Object.assign({}, mockRect, {
            width: expectedWidth,
            height: expectedHeight,
        });
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        expect(getClientRectWithMargin(element)!.bottom).to.equal(expectedRect.bottom);
        expect(getClientRectWithMargin(element)!.height).to.equal(expectedRect.height);
        expect(getClientRectWithMargin(element)!.left).to.equal(expectedRect.left);
        expect(getClientRectWithMargin(element)!.right).to.equal(expectedRect.right);
        expect(getClientRectWithMargin(element)!.top).to.equal(expectedRect.top);
        expect(getClientRectWithMargin(element)!.width).to.equal(expectedRect.width);
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
    });
});

describe("convertStylePropertyPixelsToNumber", () => {
    it("should correctly manage undefined and null values", () => {
        expect(() => convertStylePropertyPixelsToNumber(null, null)).not.to.throw();
        expect(() => convertStylePropertyPixelsToNumber(undefined, null)).not.to.throw();
        expect(() =>
            convertStylePropertyPixelsToNumber(undefined, undefined)
        ).not.to.throw();
    });

    it("should correctly convert an element's computed style property pixel value and return a number", () => {
        document.body.innerHTML = `
            <div id="element" style="margin: 20px 5px 12px 8px;"></div>
        `;
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        const element: HTMLElement = document.getElementById("element")!;

        expect(
            convertStylePropertyPixelsToNumber(
                window.getComputedStyle(element),
                "margin-top"
            )
        ).to.equal(20);
        expect(
            convertStylePropertyPixelsToNumber(
                window.getComputedStyle(element),
                "margin-bottom"
            )
        ).to.equal(12);
        expect(
            convertStylePropertyPixelsToNumber(
                window.getComputedStyle(element),
                "margin-left"
            )
        ).to.equal(8);
        expect(
            convertStylePropertyPixelsToNumber(
                window.getComputedStyle(element),
                "margin-right"
            )
        ).to.equal(5);
    });
});
