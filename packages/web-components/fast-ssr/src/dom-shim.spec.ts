import { expect, test } from "@playwright/test";
import  { createWindow } from "./dom-shim.js";

test.describe("createWindow", () => {
    test("should create a window with a document property that is an instance of the window's Document constructor", () => {
        const window = createWindow();

        expect(window.document instanceof (window.Document as any)).toBe(true);

        class MyDocument {}
        const windowOverride = createWindow({ Document: MyDocument });
        expect(windowOverride.document instanceof MyDocument).toBe(true);
    });
    test("should create a window with a customElements property that is an instance of the window's CustomElementRegistry constructor", () => {
        const window = createWindow();

        expect(window.customElements instanceof (window.CustomElementRegistry as any)).toBe(true);

        class MyRegistry {}
        const windowOverride = createWindow({ CustomElementRegistry: MyRegistry });
        expect(windowOverride.customElements instanceof MyRegistry).toBe(true);
    });
})
