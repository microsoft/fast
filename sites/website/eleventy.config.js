import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { IdAttributePlugin } from "@11ty/eleventy";
import { admonitionPlugin } from "./plugins/admonitions.js";

export default function(eleventyConfig) {
  /**
   * Styles
   */
  eleventyConfig.addPassthroughCopy("src/css/main.css");
  eleventyConfig.addPassthroughCopy("src/css/prism-vsc-dark-plus.css");
  eleventyConfig.addPassthroughCopy("src/css/variables.css");

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
  eleventyConfig.amendLibrary("md", (md) => {
    md.use(admonitionPlugin);
  });

  /**
   * Filters
   */
  eleventyConfig.addFilter("version", function(value) {
    const version = "2.x";

    if (typeof value === "string") {
        const splitUrl = value.split("/");
        return splitUrl[2] ?? version;
    }

    return version;
  });
};
