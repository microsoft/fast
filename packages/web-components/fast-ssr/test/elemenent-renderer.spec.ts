import { test, expect, ElementHandle } from '@playwright/test';
import { FASTElement } from "@microsoft/fast-element";
import { FASTElementRenderer} from "../src";

describe("FASTElementRenderer", () => {
    describe("should have a 'matchesClass' method", () => {
        test("that returns true when invoked with a class that extends FASTElement ", async ({ page }) => {
            class MyElement extends FASTElement {}
            expect(FASTElementRenderer.matchesClass(MyElement)).toBe(true);
        });
    })
})
