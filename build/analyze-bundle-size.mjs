#!/usr/bin/env node

/**
 * Bundle Size Analysis Script
 *
 * This script analyzes the bundle size of @microsoft/fast-element by creating
 * production bundles using Vite and measuring their raw and gzipped sizes.
 * Used by GitHub Actions and for local bundle size analysis.
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { resolve, join } from "path";
import { gzipSync } from "zlib";
import { build } from "vite";

function formatSize(bytes) {
    return `${(bytes / 1024).toFixed(2)} KB`;
}

async function createBundle(packageName, exportPath = ".") {
    console.log(`\n🔨 Creating bundle for ${packageName} (export: ${exportPath})...`);

    const tempDir = resolve("./.tmp/bundle-analysis");
    const entryFile = join(tempDir, "entry.js");
    const outputDir = join(tempDir, "dist");

    try {
        // Create temp directory
        mkdirSync(tempDir, { recursive: true });

        // Create entry file that imports FASTElement from the package
        const entryContent = `import { FASTElement } from '${packageName}${
            exportPath === "." ? "" : "/" + exportPath
        }';
export default FASTElement;`;
        writeFileSync(entryFile, entryContent);

        // Build with Vite
        await build({
            root: tempDir,
            build: {
                lib: {
                    entry: entryFile,
                    name: "TestBundle",
                    formats: ["es"],
                    fileName: "bundle",
                },
                outDir: outputDir,
                minify: "esbuild",
                rollupOptions: {
                    external: [], // Bundle everything
                },
            },
            logLevel: "info",
        });

        // Check what files were generated
        const fs = await import("fs");
        const files = existsSync(outputDir) ? fs.readdirSync(outputDir) : [];
        console.log("Generated files:", files);

        // Try different possible bundle names
        const possiblePaths = [
            join(outputDir, "bundle.mjs"),
            join(outputDir, "bundle.js"),
            join(outputDir, "entry.js"),
            join(outputDir, "index.js"),
        ];

        let bundlePath = null;
        for (const path of possiblePaths) {
            if (existsSync(path)) {
                bundlePath = path;
                break;
            }
        }

        if (!bundlePath) {
            throw new Error(`Bundle not found. Available files: ${files.join(", ")}`);
        }

        const content = readFileSync(bundlePath);
        const gzipped = gzipSync(content);

        const bundleResult = {
            path: bundlePath,
            raw: content.length,
            gzipped: gzipped.length,
            formatted: {
                raw: formatSize(content.length),
                gzipped: formatSize(gzipped.length),
            },
        };

        console.log(`✅ Raw size: ${bundleResult.formatted.raw}`);
        console.log(`📦 Gzipped: ${bundleResult.formatted.gzipped}`);

        return bundleResult;
    } catch (error) {
        console.log(`❌ Error creating bundle: ${error.message}`);
        return null;
    } finally {
        // Clean up temp directory
        if (existsSync(tempDir)) {
            rmSync(tempDir, { recursive: true, force: true });
        }
    }
}

async function main() {
    // Check for --output-json flag for GitHub Actions usage
    const outputJson = process.argv.includes("--output-json");
    const outputFile =
        process.argv.find(arg => arg.startsWith("--output-file="))?.split("=")[1] ||
        "bundle-size.json";

    if (!outputJson) {
        console.log("🔍 @microsoft/fast-element Bundle Size Analysis");
        console.log("===============================================");
    }

    const packagePath = "./packages/fast-element";
    if (!outputJson) {
        console.log(`Package path: ${packagePath}`);
    }

    // Check if package exists
    if (!existsSync(packagePath)) {
        const message = `❌ Package directory not found: ${packagePath}`;
        if (outputJson) {
            console.error(message);
            process.exit(1);
        } else {
            console.log(message);
            console.log("Make sure you're running this from the repository root.");
            process.exit(1);
        }
    }

    // Check if built files exist
    const distPath = resolve(packagePath, "dist");
    if (!outputJson) {
        console.log(`Dist path: ${distPath}`);
    }

    if (!existsSync(distPath)) {
        const message = `❌ Dist directory not found: ${distPath}`;
        if (outputJson) {
            console.error(message);
            process.exit(1);
        } else {
            console.log(message);
            console.log('Run "npm run build" first to generate the built files.');
            process.exit(1);
        }
    }

    // Create bundle from the main export path
    const mainResult = await createBundle("@microsoft/fast-element", ".");

    // Prepare results for output
    const results = {
        timestamp: new Date().toISOString(),
        commit: process.env.GITHUB_SHA,
        ref: process.env.GITHUB_REF,
        bundles: {
            main: mainResult
                ? {
                      raw: mainResult.raw,
                      gzipped: mainResult.gzipped,
                      exists: true,
                  }
                : {
                      raw: 0,
                      gzipped: 0,
                      exists: false,
                      error: "Bundle creation failed",
                  },
        },
    };

    if (outputJson) {
        // Output JSON for GitHub Actions
        writeFileSync(outputFile, JSON.stringify(results, null, 2));

        // Also log results for GitHub Actions console
        console.log("Bundle Size Analysis Results:");
        console.log("============================");
        if (results.bundles.main.exists) {
            console.log(`Main bundle:`);
            console.log(`  Raw size: ${(results.bundles.main.raw / 1024).toFixed(2)} KB`);
            console.log(
                `  Gzipped: ${(results.bundles.main.gzipped / 1024).toFixed(2)} KB`
            );
        } else {
            console.log(`Main bundle: FAILED - ${results.bundles.main.error}`);
        }
    } else {
        // Interactive output
        console.log("\n📊 Summary:");
        console.log("===========");

        if (mainResult) {
            console.log(
                `Main bundle: ${mainResult.formatted.raw} (${mainResult.formatted.gzipped} gzipped)`
            );
        } else {
            console.log("Main bundle: NOT AVAILABLE");
        }

        // Check package.json exports
        const packageJsonPath = resolve(packagePath, "package.json");
        if (existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
            console.log("\n📋 Package Exports:");
            console.log("==================");

            if (packageJson.exports && packageJson.exports["."]) {
                const dotExport = packageJson.exports["."];
                console.log('Root export ("."):', JSON.stringify(dotExport, null, 2));
            } else {
                console.log('No root export (".") found in package.json');
            }
        }

        console.log("\n✨ Analysis complete!");
    }
}

// Run the main function
main().catch(error => {
    console.error("❌ Script failed:", error);
    process.exit(1);
});
