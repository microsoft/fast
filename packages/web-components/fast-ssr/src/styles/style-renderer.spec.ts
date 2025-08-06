import "../install-dom-shim.js";
import { test, expect } from "@playwright/test";
import { FASTStyleStyleRenderer } from "./style-renderer.js";
import { css } from "@microsoft/fast-element";


const cssSheetRegex = /css="?(.+)"/m;
function getSheet(element: string): string | null {
    const result = cssSheetRegex.exec(element);

    if (result === null) {
        return null
    } else {
        return result[1];
    }
}
test.describe("FASTStyleStyleRenderer", () => {
    test("should return a '<fast-style'> element", () => {
        const style = css``;
        const renderer = new FASTStyleStyleRenderer();
        const tester = /<fast-style .+><\/fast-style>/
        expect(tester.test(renderer.render(style))).not.toBeNull()
    });
    test("should return a '<fast-style'> element without a 'css' attribute when the sheet has already been rendered", () => {
        const renderer = new FASTStyleStyleRenderer();
        const style = css``;
        const firstResult = renderer.render(style);
        expect(cssSheetRegex.test(firstResult)).toBe(true);

        const secondResult = renderer.render(style);

        expect(firstResult).not.toBe(secondResult);
        expect(cssSheetRegex.test(secondResult)).toBe(false)
    });

    test("should emit the sheet content into the 'css' attribute the first time a sheet instance is rendered", () => {
        const renderer = new FASTStyleStyleRenderer();
        const style = css`:host{ color: red; }`;

        const result = renderer.render(style);

        expect(getSheet(result)).toBe(':host{ color: red; }');
    });

    test("should emit the sheet content for embedded ElementStyle instances", () => {
        const renderer = new FASTStyleStyleRenderer();
        const style = css`:host{ color: red; } ${css`:host { background: blue; }`}`;

        const result = renderer.render(style);

        expect(getSheet(result)).toBe(':host{ color: red; } :host { background: blue; }');
    });


    test("should emit the sheet content for embedded strings", () => {
        const renderer = new FASTStyleStyleRenderer();
        const style = css`:host{ color: red; } ${`:host { background: blue; }`}`;

        const result = renderer.render(style);

        expect(getSheet(result)).toBe(':host{ color: red; } :host { background: blue; }');
    });
});
