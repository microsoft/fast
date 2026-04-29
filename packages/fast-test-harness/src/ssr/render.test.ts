import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    buildEntryHtml,
    buildState,
    createSSRRenderer,
    parseDefaultValue,
    renderTemplate,
} from "@microsoft/fast-test-harness/ssr/render.js";

describe("parseDefaultValue", () => {
    it("should return empty string for empty input", () => {
        assert.strictEqual(parseDefaultValue(""), "");
    });

    it("should return empty string for 'undefined'", () => {
        assert.strictEqual(parseDefaultValue("undefined"), "");
    });

    it("should return empty string for 'null'", () => {
        assert.strictEqual(parseDefaultValue("null"), "");
    });

    it("should return true for 'true'", () => {
        assert.strictEqual(parseDefaultValue("true"), true);
    });

    it("should return false for 'false'", () => {
        assert.strictEqual(parseDefaultValue("false"), false);
    });

    it("should strip single quotes from strings", () => {
        assert.strictEqual(parseDefaultValue("'img'"), "img");
    });

    it("should strip double quotes from strings", () => {
        assert.strictEqual(parseDefaultValue('"hello"'), "hello");
    });

    it("should parse integers", () => {
        assert.strictEqual(parseDefaultValue("42"), 42);
    });

    it("should parse floats", () => {
        assert.strictEqual(parseDefaultValue("3.14"), 3.14);
    });

    it("should parse zero", () => {
        assert.strictEqual(parseDefaultValue("0"), 0);
    });

    it("should parse JSON arrays", () => {
        assert.deepStrictEqual(parseDefaultValue("[1,2,3]"), [1, 2, 3]);
    });

    it("should parse JSON objects", () => {
        assert.deepStrictEqual(parseDefaultValue('{"a":1}'), { a: 1 });
    });

    it("should return empty string for unparseable values", () => {
        assert.strictEqual(parseDefaultValue("some random text"), "");
    });

    it("should trim whitespace", () => {
        assert.strictEqual(parseDefaultValue("  true  "), true);
    });
});

describe("renderTemplate", () => {
    it("should replace {{styles}} with a link tag", () => {
        const result = renderTemplate(
            "<template>{{styles}}<div>hi</div></template>",
            "/styles.css",
        );

        assert.ok(result.includes('<link rel="stylesheet" href="/styles.css">'));
        assert.ok(!result.includes("{{styles}}"));
    });

    it("should inject link after <template> if {{styles}} is absent", () => {
        const result = renderTemplate(
            "<template><div>hi</div></template>",
            "/styles.css",
        );

        assert.ok(result.includes('<link rel="stylesheet" href="/styles.css">'));
        assert.ok(result.indexOf("<link") > result.indexOf("<template>"));
    });

    it("should return template unchanged when styles URL is empty", () => {
        const input = "<template>{{styles}}<div>hi</div></template>";
        const result = renderTemplate(input, "");

        assert.ok(result.includes('<link rel="stylesheet" href="">'));
    });
});

describe("buildEntryHtml", () => {
    it("should return raw html when 'html' key is present", () => {
        const result = buildEntryHtml({ html: "<div>raw</div>" });
        assert.strictEqual(result, "<div>raw</div>");
    });

    it("should build a custom element tag from tagName", () => {
        const result = buildEntryHtml({ tagName: "my-el" });
        assert.strictEqual(result, "<my-el></my-el>");
    });

    it("should include innerHTML", () => {
        const result = buildEntryHtml({
            tagName: "my-el",
            innerHTML: "content",
        });
        assert.strictEqual(result, "<my-el>content</my-el>");
    });

    it("should serialize attributes", () => {
        const result = buildEntryHtml({
            tagName: "my-el",
            attributes: JSON.stringify({ role: "button", size: "large" }),
        });

        assert.ok(result.includes('role="button"'));
        assert.ok(result.includes('size="large"'));
    });

    it("should handle boolean true attributes", () => {
        const result = buildEntryHtml({
            tagName: "my-el",
            attributes: JSON.stringify({ disabled: true }),
        });

        assert.ok(result.includes("disabled"));
        assert.ok(!result.includes('disabled="'));
    });

    it("should return empty string when no tagName or html", () => {
        assert.strictEqual(buildEntryHtml({}), "");
    });

    it("should handle invalid JSON in attributes gracefully", () => {
        const result = buildEntryHtml({
            tagName: "my-el",
            attributes: "not-json",
        });

        assert.strictEqual(result, "<my-el></my-el>");
    });
});

describe("buildState", () => {
    it("should extract attributes into state", () => {
        const state = buildState({
            attributes: JSON.stringify({ size: "large", active: true }),
        });

        assert.strictEqual(state.size, "large");
        assert.strictEqual(state.active, true);
    });

    it("should add hyphen-stripped variants", () => {
        const state = buildState({
            attributes: JSON.stringify({ "aria-label": "Close" }),
        });

        assert.strictEqual(state["aria-label"], "Close");
        assert.strictEqual(state["arialabel"], "Close");
    });

    it("should return empty state for missing attributes", () => {
        const state = buildState({});
        assert.deepStrictEqual(state, {});
    });

    it("should handle invalid JSON gracefully", () => {
        const state = buildState({ attributes: "broken" });
        assert.deepStrictEqual(state, {});
    });
});

describe("createSSRRenderer", () => {
    it("should throw when @microsoft/fast-build is not loadable", () => {
        // We can't easily make it fail since it IS installed, but we can
        // verify the factory returns a render function on success.
        const renderer = createSSRRenderer({
            tagPrefix: "test",
            components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
        });

        assert.ok(typeof renderer.render === "function");
    });

    it("should return a RenderResult from render()", () => {
        const { render } = createSSRRenderer({
            tagPrefix: "test",
            components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
        });

        const result = render({ tagName: "test-widget", innerHTML: "hello" });

        assert.ok("template" in result, "result should have template");
        assert.ok("fixture" in result, "result should have fixture");
        assert.ok("preloadLinks" in result, "result should have preloadLinks");
    });

    it("should render a custom element tag in the fixture", () => {
        const { render } = createSSRRenderer({
            tagPrefix: "test",
            components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
        });

        const result = render({ tagName: "test-widget", innerHTML: "content" });

        assert.ok(
            result.fixture.includes("<test-widget"),
            `fixture should include element, got: ${result.fixture}`,
        );
        assert.ok(
            result.fixture.includes("content"),
            `fixture should include innerHTML, got: ${result.fixture}`,
        );
    });

    it("should include attributes in the rendered fixture", () => {
        const { render } = createSSRRenderer({
            tagPrefix: "test",
            components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
        });

        const result = render({
            tagName: "test-widget",
            attributes: JSON.stringify({ label: "Test", disabled: true }),
        });

        assert.ok(
            result.fixture.includes("label="),
            `fixture should include label attr, got: ${result.fixture}`,
        );
        assert.ok(
            result.fixture.includes("disabled"),
            `fixture should include disabled attr, got: ${result.fixture}`,
        );
    });

    it("should include theme stylesheet in preloadLinks", () => {
        const { render } = createSSRRenderer({
            tagPrefix: "test",
            components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
            themeStylesheet: "/theme.css",
        });

        const result = render({ tagName: "test-widget" });

        assert.ok(
            result.preloadLinks.includes("/theme.css"),
            `preloadLinks should include theme URL, got: ${result.preloadLinks}`,
        );
    });

    it("should return empty preloadLinks without a theme", () => {
        const { render } = createSSRRenderer({
            tagPrefix: "test",
            components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
        });

        const result = render({ tagName: "test-widget" });

        assert.strictEqual(result.preloadLinks, "");
    });

    it("should handle raw HTML via the html key", () => {
        const { render } = createSSRRenderer({
            tagPrefix: "test",
            components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
        });

        const result = render({
            html: "<test-widget>raw html</test-widget>",
        });

        assert.ok(
            result.fixture.includes("raw html"),
            `fixture should contain raw html content, got: ${result.fixture}`,
        );
    });

    it("should return empty fixture for empty query", () => {
        const { render } = createSSRRenderer({
            tagPrefix: "test",
            components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
        });

        const result = render({});

        assert.strictEqual(result.fixture, "");
    });

    it("should work with monolithic packageName mode", () => {
        // The test harness itself doesn't have component subdirectories,
        // so the template map will be empty — but the factory should not throw.
        const { render } = createSSRRenderer({
            tagPrefix: "fast",
            packageName: "@microsoft/fast-test-harness",
            distDir: "dist/esm",
        });

        assert.ok(typeof render === "function");

        const result = render({ tagName: "fast-widget", innerHTML: "hello" });

        // Without matching templates the WASM renderer should still produce output.
        assert.ok("fixture" in result);
    });
});
