import { Anchor } from "@microsoft/fast-foundation";
import { expect, test } from "@playwright/test";
import exp from "constants";

test("foo", () => {
    expect(() => {
        const el = new Anchor();

        el.connectedCallback();
    }).not.toThrow()
})
