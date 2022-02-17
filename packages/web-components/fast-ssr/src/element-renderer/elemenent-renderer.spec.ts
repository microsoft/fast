import "@lit-labs/ssr/lib/install-global-dom-shim.js";
import { FASTElement } from "@microsoft/fast-element";
import { expect, test } from '@playwright/test';
import { FASTElementRenderer } from "./element-renderer.js";

test.describe("FASTElementRenderer", () => {
    test.describe("should have a 'matchesClass' method", () => {
        test("that returns true when invoked with a class that extends FASTElement ",  () => {
            class MyElement extends FASTElement {}
            expect(FASTElementRenderer.matchesClass(MyElement)).toBe(true);
        });
        test("that returns false when invoked with a class that does not extend FASTElement ", () => {
            class MyElement extends HTMLElement {}
            expect(FASTElementRenderer.matchesClass(MyElement)).toBe(false);
        });
    })
})
