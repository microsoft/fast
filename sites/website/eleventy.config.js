import { IdAttributePlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { admonitionPlugin } from "./plugins/admonitions.js";

export default function (eleventyConfig) {
    /**
     * Styles
     */
    eleventyConfig.addPassthroughCopy("src/css/main.css");
    eleventyConfig.addPassthroughCopy("src/css/prism-vsc-dark-plus.css");
    eleventyConfig.addPassthroughCopy("src/css/variables.css");
    eleventyConfig.addPassthroughCopy("src/css/version-banner.css");

    /**
     * Scripts
     */
    eleventyConfig.addPassthroughCopy("src/js/sidebar-navigation.js");
    eleventyConfig.addPassthroughCopy("src/js/navbar-toggle.js");

    /**
     * Assets
     */
    eleventyConfig.addPassthroughCopy("src/static/favicon.ico");
    eleventyConfig.addPassthroughCopy("src/static/fast-inline-logo.svg");

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
        const version = "3.x";

        if (typeof value === "string") {
            const splitUrl = value.split("/");
            return splitUrl[2] ?? version;
        }

        return version;
    });

    /**
     * Flatten an eleventy-navigation tree depth-first and return the entries
     * immediately before and after the current page URL. Used to derive
     * prev/next pagination from the sidebar order.
     */
    eleventyConfig.addFilter("prevNext", function (navTree, currentUrl) {
        const flat = [];

        (function walk(nodes) {
            if (!Array.isArray(nodes)) return;
            for (const node of nodes) {
                if (node?.url) {
                    flat.push({ url: node.url, title: node.title });
                }
                if (node?.children?.length) {
                    walk(node.children);
                }
            }
        })(navTree);

        const idx = flat.findIndex(entry => entry.url === currentUrl);
        if (idx === -1) {
            return { prev: null, next: null };
        }

        return {
            prev: idx > 0 ? flat[idx - 1] : null,
            next: idx < flat.length - 1 ? flat[idx + 1] : null,
        };
    });
}
