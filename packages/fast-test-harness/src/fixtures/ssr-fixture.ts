import type { Page } from "@playwright/test";
import { CSRFixture, type TemplateOrOptions } from "./csr-fixture.js";

export class SSRFixture extends CSRFixture {
    /**
     * Styles buffered before {@link setTemplate} is called.
     */
    private pendingStyles: Parameters<Page["addStyleTag"]>[0][] = [];

    /**
     * Whether the template has been rendered.
     */
    private templateRendered = false;

    /**
     * Creates an instance of the SSRFixture.
     *
     * @param page - The Playwright page object.
     * @param tagName - The tag name of the custom element.
     * @param innerHTML - The inner HTML of the custom element.
     * @param waitFor - Additional custom elements to wait for.
     * @param testId - The test ID for the SSR fixture.
     * @param testTitle - The test title for the SSR fixture.
     */
    constructor(
        page: Page,
        tagName: string,
        innerHTML: string = "",
        waitFor: string[] = [],
        private readonly testId?: string,
        private readonly testTitle?: string,
    ) {
        super(page, tagName, innerHTML, waitFor);
    }

    /**
     * Buffers style tags added before {@link setTemplate} so they can be
     * included in the generated SSR page. After the template has been
     * rendered, calls pass through to the page directly.
     *
     * @param options - The options for the style tag.
     * @see {@link Page.addStyleTag}
     */
    override async addStyleTag(
        options: Parameters<Page["addStyleTag"]>[0],
    ): Promise<void> {
        if (this.templateRendered) {
            await this.page.addStyleTag(options);
            return;
        }
        this.pendingStyles.push(options);
    }

    /**
     * Sets up the test fixture by posting the template or configuration
     * to the SSR generation endpoint.
     *
     * This method constructs a request body based on the provided
     * `templateOrOptions` and the current test context (like `testId`
     * and `testTitle`). It sends this data to the `/generate-fixture`
     * endpoint to create a server-side rendered fixture, navigates the
     * page to the resulting URL, and waits for the page to stabilize.
     *
     * @param templateOrOptions - The template configuration.
     */
    override async setTemplate(templateOrOptions?: TemplateOrOptions): Promise<void> {
        const body: Record<string, string> = {};

        if (this.testId) {
            body.testId = this.testId;
            body.testTitle = this.testTitle || this.formatTestTitle(this.testId);
        }

        if (typeof templateOrOptions === "string") {
            body.html = templateOrOptions.trim();
        }

        if (typeof templateOrOptions === "object") {
            if (typeof templateOrOptions.innerHTML === "string") {
                body.innerHTML = templateOrOptions.innerHTML;
            }

            if (templateOrOptions.attributes) {
                const cleanedAttributes: Record<string, string | true> = {};
                Object.entries(templateOrOptions.attributes).forEach(([key, value]) => {
                    cleanedAttributes[key.trim()] =
                        typeof value === "string" ? value.trim() : value;
                });
                body.attributes = JSON.stringify(cleanedAttributes);
            }
        }

        if (!body.html && typeof templateOrOptions !== "string") {
            body.tagName = this.tagName;
            if (!body.innerHTML && typeof templateOrOptions?.innerHTML !== "string") {
                body.innerHTML = this.innerHTML;
            }
        }

        Object.entries(body).forEach(([key, value]) => {
            if (typeof value === "string") {
                body[key] = value.replace(/\s+/g, " ").trim();
            }
        });

        if (this.pendingStyles.length) {
            body.styles = JSON.stringify(
                this.pendingStyles.map(s => s?.content).filter((c): c is string => !!c),
            );
        }

        const response = await this.page.request.post("/generate-fixture", {
            data: body,
        });

        if (!response.ok()) {
            throw new Error(
                `Failed to generate fixture: ${response.status()} ${response.statusText()}`,
            );
        }

        const result = await response.json();

        if (!result.url) {
            throw new Error(`Invalid response from server: ${JSON.stringify(result)}`);
        }

        await this.page.goto(result.url);

        await this.waitForStability();

        this.templateRendered = true;
        this.pendingStyles.length = 0;
    }

    /**
     * Formats the test title based on the provided test ID.
     */
    private formatTestTitle(testId: string): string {
        const match = testId.match(/^(.*?\.(ts|js))-(.+)$/);
        if (!match) {
            return testId
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }

        const filePath = match[1];
        const testParts = match[3];

        const sections = testParts.split("-").map(section =>
            section
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
        );

        return `${sections.join(" › ")} (${filePath})`;
    }
}
