import { expect, test } from "@playwright/test";
import type {
    format as formatType,
    isNullOrWhiteSpace as isNullOrWhiteSpaceType,
    pascalCase as pascalCaseType,
    spinalCase as spinalCaseType,
    startsWith as startsWithType,
} from "./strings.js";

declare const format: typeof formatType;
test.describe("format", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { format } from "/dist/strings.js";
                globalThis.format = format;
            `,
        });

        await page.waitForFunction(() => "format" in globalThis);
    });

    test("should correctly manage `undefined` by returning an unformatted string", async ({
        page,
    }) => {
        expect(
            await page.evaluate(f => {
                return format.call(null, f, undefined);
            }, "Hello {0} world")
        ).toBe("Hello  world");
    });

    test("should correctly manage null by returning an unformatted string", async ({
        page,
    }) => {
        expect(
            await page.evaluate(f => {
                return format.call(null, f, null);
            }, "Hello {0} world")
        ).toBe("Hello  world");
    });

    test("should correctly manage having too many parameters", async ({ page }) => {
        expect(
            await page.evaluate(f => {
                return format.call(null, f, "page", "five", "now");
            }, "View {0} {1}")
        ).toBe("View page five");
    });

    test("should correctly manage a formatter with not enough parameters", async ({
        page,
    }) => {
        expect(
            await page.evaluate(f => {
                return format.call(null, f, "page");
            }, "View {0} {1}")
        ).toBe("View page {1}");
    });

    test("should correctly manage empty strings by returning a formatted string with white space", async ({
        page,
    }) => {
        expect(
            await page.evaluate(f => {
                return format.call(null, f, "");
            }, "Hello {0} world")
        ).toBe("Hello  world");
    });

    test("should correctly manage strings by returning a formatted string", async ({
        page,
    }) => {
        expect(
            await page.evaluate(f => {
                return format.call(null, f, "foo");
            }, "Hello {0} world")
        ).toBe("Hello foo world");
    });

    test("should correctly manage multiple strings parameters", async ({ page }) => {
        expect(
            await page.evaluate(f => format.call(null, f, "page", "five"), "View {0} {1}")
        ).toBe("View page five");
    });

    test("should correctly manage non-formatted strings by returning the initial string", async ({
        page,
    }) => {
        expect(
            await page.evaluate(f => {
                return format.call(null, f, "world");
            }, "Hello")
        ).toBe("Hello");
    });
});

declare const isNullOrWhiteSpace: typeof isNullOrWhiteSpaceType;
test.describe("isNullOrWhiteSpace", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { isNullOrWhiteSpace } from "/dist/strings.js";
                globalThis.isNullOrWhiteSpace = isNullOrWhiteSpace;
            `,
        });

        await page.waitForFunction(() => "isNullOrWhiteSpace" in globalThis);
    });

    test("should correctly manage undefined", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return isNullOrWhiteSpace.call(null, undefined);
            })
        ).toBe(true);
    });

    test("should correctly manage null", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return isNullOrWhiteSpace.call(null, null);
            })
        ).toBe(true);
    });

    test("should correctly manage a value with only white space", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return isNullOrWhiteSpace("\t\n ");
            })
        ).toBe(true);
    });

    test("should correctly manage a value without white space", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return isNullOrWhiteSpace("foobar");
            })
        ).toBe(false);
    });
});

declare const pascalCase: typeof pascalCaseType;
test.describe("pascalCase", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { pascalCase } from "/dist/strings.js";
                globalThis.pascalCase = pascalCase;
            `,
        });

        await page.waitForFunction(() => "pascalCase" in globalThis);
    });

    test("should correctly manage hyphenated strings", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return pascalCase("string-extensions");
            })
        ).toBe("StringExtensions");
    });

    test("should correctly manage strings with whitespace", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return pascalCase(" foo bar ");
            })
        ).toBe("FooBar");
    });

    test("should correctly manage all caps strings", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return pascalCase("STRING EXTENSIONS");
            })
        ).toBe("StringExtensions");
    });

    test("should no-op on existing pascal case", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return pascalCase("StringExtensions");
            })
        ).toBe("StringExtensions");
    });

    test("should correctly manage one capital case with no whitespace", async ({
        page,
    }) => {
        expect(
            await page.evaluate(() => {
                return pascalCase("thinkIAm");
            })
        ).toBe("ThinkIAm");
    });

    test("should correctly manage strings with dashes", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return pascalCase("--foo bar--");
            })
        ).toBe("FooBar");
    });

    test("should correctly manage strings with underscores", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return pascalCase("__foo bar__");
            })
        ).toBe("FooBar");
    });
});

declare const spinalCase: typeof spinalCaseType;
test.describe("spinalCase", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { spinalCase } from "/dist/strings.js";
                globalThis.spinalCase = spinalCase;
            `,
        });

        await page.waitForFunction(() => "spinalCase" in globalThis);
    });

    test("should convert pascalCase strings", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return spinalCase("stringExtensions");
            })
        ).toBe("string-extensions");
    });

    test("should convert CamelCase strings", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return spinalCase("StringExtensions");
            })
        ).toBe("string-extensions");
    });

    test("should convert CamelCase with numbers", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return spinalCase("typeRampMinus1FontSize");
            })
        ).toBe("type-ramp-minus-1-font-size");
    });
});

declare const startsWith: typeof startsWithType;
test.describe("startsWith", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { startsWith } from "/dist/strings.js";
                globalThis.startsWith = startsWith;
            `,
        });

        await page.waitForFunction(() => "startsWith" in globalThis);
    });

    test("should correctly manage undefined", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return startsWith.call(null, undefined, undefined);
            })
        ).toBe(false);
        expect(
            await page.evaluate(() => {
                return startsWith.call(null, "Hello", undefined);
            })
        ).toBe(false);
    });

    test("should correctly manage null", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return startsWith.call(null, null, null);
            })
        ).toBe(false);
        expect(
            await page.evaluate(() => {
                return startsWith.call(null, "Hello", null);
            })
        ).toBe(false);
    });

    test("should correctly manage searching for an empty string", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return startsWith("Helloworld", "");
            })
        ).toBe(false);
    });

    test("should correctly manage a string which includes a match but does not start with it", async ({
        page,
    }) => {
        expect(
            await page.evaluate(() => {
                return startsWith("HelloWorld", "World");
            })
        ).toBe(false);
    });

    test("should correctly manage finding a valid string that starts with a match", async ({
        page,
    }) => {
        expect(
            await page.evaluate(() => {
                return startsWith("start", "start");
            })
        ).toBe(true);

        expect(
            await page.evaluate(() => {
                return startsWith("start", "star");
            })
        ).toBe(true);
    });

    test("should correctly manage incorrect casing as an invalid match", async ({
        page,
    }) => {
        expect(
            await page.evaluate(() => {
                return startsWith("start", "START");
            })
        ).toBe(false);
    });
});
