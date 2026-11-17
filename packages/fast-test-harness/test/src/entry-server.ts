import { fileURLToPath } from "node:url";
import { createSSRRenderer } from "@microsoft/fast-test-harness/ssr/render.js";

const { render } = createSSRRenderer({
    tagPrefix: "test",
    nativeAddonPath: fileURLToPath(
        new URL(
            "../../../../crates/microsoft-fast-build/target/node-host/fast-build.node",
            import.meta.url,
        ),
    ),
    components: [{ name: "widget", packageName: "@microsoft/fast-test-harness" }],
    themeStylesheet: "/test-theme.css",
});

export { render };
