import { FASTElement } from "./fast-element.js";
describe("FASTElement", () => {
    it ("instanceof checks should provide TypeScript support for HTMLElement and FASTElement methods and properties", () => {
        // This test is designed to test TypeScript support and does not contain any assertions.
        // A 'failure' will prevent the test from compiling.
        const myElement: unknown = undefined;

        if (myElement instanceof FASTElement) {
            myElement.$fastController;
            myElement.querySelectorAll;
        }
    })
});
