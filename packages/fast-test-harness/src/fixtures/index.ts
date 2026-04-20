import { expect as baseExpect, test as baseTest } from "@playwright/test";
import { toHaveCustomState } from "./assertions.js";
import { CSRFixture } from "./csr-fixture.js";
import { SSRFixture } from "./ssr-fixture.js";

const isSSR = process.env.PLAYWRIGHT_TEST_SSR === "true";

type FixtureOptions = {
    /**
     * Additional HTML to insert into the element.
     */
    innerHTML: string;

    /**
     * Indicates if the test is running in SSR mode.
     */
    ssr: boolean;

    /**
     * The tag name of the custom element to test.
     */
    tagName: string;

    /**
     * Additional custom elements to wait for before running the test.
     */
    waitFor: string[];
};

export type Fixtures = {
    fastPage: CSRFixture | SSRFixture;
};

export const test = baseTest.extend<Fixtures & FixtureOptions>({
    /**
     * The inner HTML to set on the fixture's custom element. This can be used
     * to provide slotted content or otherwise customize the fixture's template.
     */
    innerHTML: ["", { option: true }],

    /**
     * The tag name of the custom element to test. This is used to construct the
     * fixture's template and to determine when the page has finished loading.
     */
    tagName: ["", { option: true }],

    /**
     * Additional custom elements to wait for before running the test.
     */
    waitFor: [[], { option: true }],

    /**
     * Indicates if the test is running in SSR mode. When `true`, the fixture
     * uses the `SSRFixture` class, which generates server-rendered fixtures.
     *
     * This can be set directly in a fixture via `test.use({ ssr: true })`, or
     * indirectly with the environment variable `PLAYWRIGHT_TEST_SSR=true`.
     */
    ssr: [!!isSSR, { option: true }],

    async fastPage(
        { page, innerHTML, ssr, tagName, waitFor },
        use,
        testInfo,
    ): Promise<void> {
        const testId = testInfo.titlePath
            .join("-")
            .replace(/[^a-z0-9-]/gi, "_")
            .toLowerCase();

        const testTitle = ssr ? `${testInfo.titlePath.join(" › ")}` : undefined;

        const fastPage = ssr
            ? new SSRFixture(page, tagName, innerHTML, waitFor, testId, testTitle)
            : new CSRFixture(page, tagName, innerHTML, waitFor);

        if (!ssr) {
            await fastPage.goto();
            await page.emulateMedia({ reducedMotion: "reduce" });
            await fastPage.waitForCustomElement(tagName, ...waitFor);
        }

        await use(fastPage);
    },
});

export const expect = baseExpect.extend({
    toHaveCustomState,
});
