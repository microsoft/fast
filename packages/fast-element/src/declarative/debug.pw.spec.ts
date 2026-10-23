import { expect, test } from "@playwright/test";
import { enableDebug } from "../debug.js";
import { FAST } from "../platform.js";
import { ensureDeclarativeRuntime } from "./runtime.js";

test.describe("declarative template diagnostics", () => {
    for (const code of [2000, 2001]) {
        test(`error ${code} links to the template syntax guide`, () => {
            enableDebug();
            ensureDeclarativeRuntime();

            const error = FAST.error(code, { name: "my-element" });

            expect(error.message).toContain("my-element");
            expect(error.message).toContain(
                "https://fast.design/docs/3.x/declarative-templates/f-templates/",
            );
        });
    }
});
