import type { Locator, Page } from "@playwright/test";

export type ThemeTokens = Record<string, string | number | boolean>;

/**
 * The initial attributes for the fixture's template, where boolean attributes are
 * represented as `true` and omitted when `false`. This allows for a more intuitive
 * configuration of boolean attributes in the template options.
 */
export type InitialTemplateAttributes = Record<string, string | true>;

/**
 * The attributes for the fixture's template, where boolean attributes can be represented as `true`
 * or `false`. When `true`, the attribute will be included without a value (e.g., `disabled`), and
 * when `false`, the attribute will be omitted entirely. This type is used for updating the
 * template, allowing for both adding and removing boolean attributes.
 */
export type TemplateAttributes = Record<string, string | boolean>;

/**
 * The options for configuring the fixture's template.
 */
export type InitialTemplateOptions = {
    attributes?: InitialTemplateAttributes;
    innerHTML?: string;
};

/**
 * The options for updating the fixture's template, where `attributes` can include boolean values to
 * add or remove attributes from the element.
 */
export type FixtureOptions = Omit<InitialTemplateOptions, "attributes"> & {
    attributes?: TemplateAttributes;
};

/**
 * The template configuration, which can be a raw HTML string or fixture
 * options.
 */
export type TemplateOrOptions = InitialTemplateOptions | string;

/**
 * A fixture for testing FAST components with Playwright.
 */
export class CSRFixture {
    /**
     * The Playwright locator for the custom element.
     */
    public readonly element: Locator;

    /**
     * The tag name of the custom element.
     */
    protected readonly tagName: string;

    /**
     * The inner HTML of the custom element.
     */
    protected readonly innerHTML: string;

    /**
     * Additional custom elements to wait for before running the test.
     *
     * @remarks
     * This is useful for fixtures that depend on multiple custom elements being defined
     * and stable before the test can run. By specifying additional tag names here, the
     * fixture will wait for these elements to be defined before proceeding. Ensure that
     * any elements specified here are included on the page and properly defined to
     * prevent test timeouts.
     *
     * @example
     * test.use({
     *     tagName: "fast-dropdown",
     *     waitFor: ["fast-listbox", "fast-option"],
     * });
     */
    protected readonly waitFor: string[];

    /**
     * Creates an instance of the CSRFixture.
     *
     * @param page - The Playwright page object.
     * @param tagName - The tag name of the custom element.
     * @param innerHTML - The inner HTML of the custom element.
     * @param waitFor - Additional custom elements to wait for.
     */
    constructor(
        public readonly page: Page,
        tagName: string,
        innerHTML: string,
        waitFor: string[] = [],
    ) {
        this.tagName = tagName;
        this.innerHTML = innerHTML;
        this.element = this.page.locator(this.tagName);
        this.waitFor = waitFor;
    }

    /**
     * Adds a style tag to the page.
     *
     * @param options - The options for the style tag.
     * @see {@link Page.addStyleTag}
     */
    async addStyleTag(options: Parameters<Page["addStyleTag"]>[0]): Promise<void> {
        await this.page.addStyleTag(options);
    }

    /**
     * Navigates to the specified URL.
     *
     * @param url - The URL to navigate to. Defaults to "/".
     */
    async goto(url: string = "/") {
        await this.page.goto(url);
    }

    /**
     * Applies a set of design tokens as CSS custom properties on the body.
     *
     * @param tokens - A record mapping token names to values. Each key will
     *   be prefixed with `--` and set as a CSS custom property.
     */
    async applyTokens(tokens: ThemeTokens): Promise<void> {
        await this.page.evaluate(async theme => {
            Object.entries(theme).forEach(([key, value]) => {
                document.body.style.setProperty(
                    `--${key}`,
                    typeof value === "string" ? value : `${value}`,
                );
            });
        }, tokens);
    }

    /**
     * Generates the default template for the fixture.
     */
    private defaultTemplate(
        tagName: string = this.tagName,
        attributes: InitialTemplateAttributes = {},
        innerHTML: string = this.innerHTML,
    ) {
        const attributesString = Object.entries(attributes)
            .map(([key, value]) => {
                if (value === true) {
                    return key;
                }

                return `${key}="${value.replace(/"/g, "")}"`;
            })
            .join(" ");

        return `<${tagName} ${attributesString}>${innerHTML}</${tagName}>`;
    }

    /**
     * Sets the template for the fixture's page.
     *
     * When `templateOrOptions` is an object, the method merges specific
     * template options with values configured via the Playwright `test.use`
     * configuration for the current test suite.
     *
     * If `templateOrOptions` is a string, it is treated as the complete HTML
     * body for the fixture.
     *
     * If `templateOrOptions` is not provided, the method uses the default
     * template based on the fixture's `tagName` and `innerHTML` properties.
     *
     * @param templateOrOptions - The template configuration.
     */
    async setTemplate(templateOrOptions?: TemplateOrOptions): Promise<void> {
        const template =
            typeof templateOrOptions === "string"
                ? templateOrOptions
                : this.defaultTemplate(
                      this.tagName,
                      templateOrOptions?.attributes,
                      templateOrOptions?.innerHTML,
                  );

        await this.page.locator("body").evaluate((node, template) => {
            const fragment = document.createRange().createContextualFragment(template);
            node.innerHTML = "";
            node.append(fragment);
        }, template);

        if (this.tagName) {
            await this.waitForStability();
        }
    }

    /**
     * Waits for the fixture to reach a stable state.
     *
     * This includes waiting for the custom element and any additional
     * specified elements to be defined and for the body to become stable.
     */
    protected async waitForStability(): Promise<void> {
        if ((await this.element.count()) > 0) {
            const elements = await this.page
                .locator([this.tagName, ...this.waitFor].join(","))
                .all();

            await Promise.allSettled(
                elements.map(element =>
                    element.waitFor({
                        state: "attached",
                        timeout: 1000,
                    }),
                ),
            );
        }

        await this.waitForCustomElement(this.tagName, ...this.waitFor);

        await (await this.page.locator("body").elementHandle())?.waitForElementState(
            "stable",
        );
    }

    /**
     * Updates the content of the fixture by modifying the specified
     * element's attributes and/or inner HTML.
     *
     * @param locator - The locator or selector for the element to update.
     * @param options - The options for updating the element.
     */
    async updateTemplate(
        locator: string | Locator,
        options: FixtureOptions,
    ): Promise<void> {
        const element =
            typeof locator === "string" ? this.page.locator(locator) : locator;

        await element.evaluate((node, options) => {
            if (options.innerHTML !== undefined) {
                node.innerHTML = options.innerHTML;
            }

            if (options.attributes) {
                const attributesAsJSON = options.attributes;

                Object.entries(attributesAsJSON).forEach(([key, value]) => {
                    if (value === true) {
                        node.setAttribute(key, "");
                    } else if (value === false) {
                        node.removeAttribute(key);
                    } else if (typeof value === "string") {
                        node.setAttribute(key, value);
                    }
                });
            }
        }, options);
    }

    /**
     * Waits for the specified custom elements to be defined in the
     * browser's CustomElementRegistry.
     *
     * @param tagName - The primary tag name to wait for.
     * @param tagNames - Additional tag names to wait for.
     */
    async waitForCustomElement(
        tagName: string = this.tagName,
        ...tagNames: string[]
    ): Promise<void> {
        if (!tagName && !tagNames.length) {
            return;
        }

        await this.page.waitForFunction(
            (tagNames: string[]) =>
                Promise.all(tagNames.map(t => customElements.whenDefined(t))),
            [tagName, ...tagNames],
        );
    }
}
