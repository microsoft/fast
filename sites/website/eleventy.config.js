import { createRequire } from "node:module";
import path from "node:path";
import { IdAttributePlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { admonitionPlugin } from "./plugins/admonitions.js";

const require = createRequire(import.meta.url);
const githubMarkdownCssDir = path.dirname(
    require.resolve("github-markdown-css/package.json"),
);

export default function (eleventyConfig) {
    /**
     * Styles
     */
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy({
        [path.join(githubMarkdownCssDir, "github-markdown-dark.css")]:
            "css/github-markdown-dark.css",
    });

    /**
     * Scripts
     */
    eleventyConfig.addPassthroughCopy("src/js");

    /**
     * Assets
     */
    eleventyConfig.addPassthroughCopy("src/static");

    /**
     * Plugins
     */
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(IdAttributePlugin);

    /**
     * Markdown
     */
    eleventyConfig.amendLibrary("md", md => {
        md.use(admonitionPlugin);
    });

    /**
     * Filters
     */
    eleventyConfig.addFilter("version", function (value) {
        const version = "2.x";

        if (typeof value === "string") {
            const splitUrl = value.split("/");
            return splitUrl[2] ?? version;
        }

        return version;
    });
}
