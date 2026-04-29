import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { installDomShim } from "@microsoft/fast-test-harness/build/dom-shim.js";
import { generateStylesheets } from "@microsoft/fast-test-harness/build/generate-stylesheets.js";

installDomShim();

describe("generateStylesheets", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), "fast-styles-"));
    });

    afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    it("should extract CSS from a styles module", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        // Write a fake styles module that exports an ElementStyles-like object.
        await writeFile(
            join(distDir, "button.styles.js"),
            `export const styles = { styles: [":host { display: block; }", "span { color: red; }"] };`,
        );

        await generateStylesheets({ cwd: tempDir });

        const css = await readFile(join(distDir, "button.styles.css"), "utf8");
        assert.ok(css.includes(":host { display: block; }"));
        assert.ok(css.includes("span { color: red; }"));
    });

    it("should write to outDir when specified", async () => {
        const distDir = join(tempDir, "dist");
        const outDir = join(tempDir, "out");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "card.styles.js"),
            `export const styles = { styles: [".card { padding: 8px; }"] };`,
        );

        await generateStylesheets({ cwd: tempDir, outDir: "out" });

        const css = await readFile(join(outDir, "card.styles.css"), "utf8");
        assert.ok(css.includes(".card { padding: 8px; }"));
    });

    it("should apply a format function", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "link.styles.js"),
            `export const styles = { styles: ["a { color: blue; }"] };`,
        );

        await generateStylesheets({
            cwd: tempDir,
            format: css => `/* formatted */\n${css}`,
        });

        const css = await readFile(join(distDir, "link.styles.css"), "utf8");
        assert.ok(css.startsWith("/* formatted */"));
    });

    it("should flatten nested styles arrays", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "nested.styles.js"),
            `export const styles = {
                styles: [
                    { styles: [":host { display: flex; }", "div { margin: 0; }"] },
                    "span { font-size: 14px; }"
                ]
            };`,
        );

        await generateStylesheets({ cwd: tempDir });

        const css = await readFile(join(distDir, "nested.styles.css"), "utf8");
        assert.ok(css.includes(":host { display: flex; }"));
        assert.ok(css.includes("div { margin: 0; }"));
        assert.ok(css.includes("span { font-size: 14px; }"));
    });

    it("should skip modules without a styles export", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "empty.styles.js"),
            `export const template = "<div></div>";`,
        );

        await generateStylesheets({ cwd: tempDir });

        // Should not create a CSS file
        try {
            await readFile(join(distDir, "empty.styles.css"), "utf8");
            assert.fail("Should not have created a CSS file");
        } catch (err: any) {
            assert.strictEqual(err.code, "ENOENT");
        }
    });
});
