import assert from "node:assert/strict";
import { test } from "node:test";
import type { Page } from "@playwright/test";
import { CSRFixture } from "@microsoft/fast-test-harness/fixtures/csr-fixture.js";
import { SSRFixture } from "@microsoft/fast-test-harness/fixtures/ssr-fixture.js";

class TestSSRFixture extends SSRFixture {
    protected override async waitForStability(): Promise<void> {}
}

test("CSRFixture navigates to its normalized base path", async () => {
    let navigatedTo: string | undefined;
    const page = {
        goto: async (url: string) => {
            navigatedTo = url;
        },
        locator: () => ({}),
    } as unknown as Page;
    const fixture = new CSRFixture(page, "test-element", "", [], "components/test");

    await fixture.goto();

    assert.equal(navigatedTo, "/components/test/");
});

test("SSRFixture generates and opens a fixture under its base path", async () => {
    let navigatedTo: string | undefined;
    let postedTo: string | undefined;
    const fixtureUrl = "/components/test/ssr-fixture.html";
    const page = {
        goto: async (url: string) => {
            navigatedTo = url;
        },
        locator: () => ({}),
        request: {
            post: async (url: string) => {
                postedTo = url;
                return {
                    json: async () => ({ url: fixtureUrl }),
                    ok: () => true,
                };
            },
        },
    } as unknown as Page;
    const fixture = new TestSSRFixture(
        page,
        "test-element",
        "",
        [],
        "fixture",
        undefined,
        "components/test",
    );

    await fixture.setTemplate();

    assert.equal(postedTo, "/components/test/generate-fixture");
    assert.equal(navigatedTo, fixtureUrl);
});
