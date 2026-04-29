import { createSSRRenderer } from "@microsoft/fast-test-harness/ssr/render.js";

const { render } = createSSRRenderer({
    tagPrefix: "test",
    components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
    themeStylesheet: "/test-theme.css",
});

export { render };
