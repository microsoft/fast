import { test, expect } from "@playwright/test";
import { TemplateRenderer } from "./template-renderer.js";
import { template } from "@babel/core";

test.describe("TemplateRenderer", () => {
    test.describe("should have an initial configuration", () => {
        test("that emits to shadow DOM", () => {
            const instance = new TemplateRenderer();
            expect(instance.componentDOMEmissionMode).toBe("shadow")
        });
    });

    test.describe("should allow configuration", () => {
        test("that emits to light DOM", () => {
            const instance = new TemplateRenderer({componentDOMEmissionMode: "light"});
            expect(instance.componentDOMEmissionMode).toBe("light")
        })
    })
});
