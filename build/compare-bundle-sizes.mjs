#!/usr/bin/env node

/**
 * Bundle Size Comparison Script
 *
 * This script compares bundle size results from two JSON files and generates a report.
 * Used by the GitHub Action to create bundle size comparison reports for PRs.
 */

import { readFileSync, writeFileSync } from "fs";

function formatSize(bytes) {
    return `${(bytes / 1024).toFixed(2)} KB`;
}

function formatDiff(current, previous) {
    const diff = current - previous;
    const percentage = previous > 0 ? (diff / previous) * 100 : 0;
    const sign = diff > 0 ? "+" : "";
    const emoji = diff > 0 ? "📈" : diff < 0 ? "📉" : "➡️";

    return {
        diff,
        percentage,
        formatted: `${sign}${formatSize(diff)} (${sign}${percentage.toFixed(2)}%)`,
        emoji,
    };
}

async function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const prFile =
        args.find(arg => arg.startsWith("--pr-file="))?.split("=")[1] ||
        "bundle-size-pr.json";
    const baseFile =
        args.find(arg => arg.startsWith("--base-file="))?.split("=")[1] ||
        "bundle-size-base.json";
    const outputFile =
        args.find(arg => arg.startsWith("--output-file="))?.split("=")[1] ||
        "bundle-report.md";

    try {
        console.log("📊 Comparing bundle sizes...");
        console.log(`PR file: ${prFile}`);
        console.log(`Base file: ${baseFile}`);

        const prData = JSON.parse(readFileSync(prFile, "utf8"));
        const baseData = JSON.parse(readFileSync(baseFile, "utf8"));

        let report = "## 📦 Bundle Size Report\n\n";
        report += "> Bundle size analysis for `@microsoft/fast-element` package\n\n";

        // Main bundle comparison
        if (prData.bundles.main.exists && baseData.bundles.main.exists) {
            const rawDiff = formatDiff(
                prData.bundles.main.raw,
                baseData.bundles.main.raw
            );
            const gzipDiff = formatDiff(
                prData.bundles.main.gzipped,
                baseData.bundles.main.gzipped
            );

            report += `### ${rawDiff.emoji} Main Bundle (\`@microsoft/fast-element\`)\n\n`;
            report += "| Metric | Current | Previous | Change |\n";
            report += "|--------|---------|----------|--------|\n";
            report += `| Raw Size | ${formatSize(prData.bundles.main.raw)} | ${formatSize(
                baseData.bundles.main.raw
            )} | ${rawDiff.formatted} |\n`;
            report += `| Gzipped | ${formatSize(
                prData.bundles.main.gzipped
            )} | ${formatSize(baseData.bundles.main.gzipped)} | ${
                gzipDiff.formatted
            } |\n\n`;

            // Add alerts for significant changes
            if (Math.abs(rawDiff.percentage) > 5) {
                const alertType = rawDiff.diff > 0 ? "🚨" : "🎉";
                const changeType = rawDiff.diff > 0 ? "increase" : "decrease";
                report += `${alertType} **Significant bundle size ${changeType}!** (${rawDiff.formatted})\n\n`;
            }

            // Console output for GitHub Actions logs
            console.log(`✅ Bundle size comparison completed:`);
            console.log(
                `   Raw size: ${formatSize(prData.bundles.main.raw)} (${
                    rawDiff.formatted
                })`
            );
            console.log(
                `   Gzipped: ${formatSize(prData.bundles.main.gzipped)} (${
                    gzipDiff.formatted
                })`
            );
        } else if (!prData.bundles.main.exists) {
            report += "❌ **Main bundle not found in PR branch**\n\n";
            console.log("❌ Main bundle not found in PR branch");
        } else if (!baseData.bundles.main.exists) {
            report +=
                "⚠️ **Main bundle not found in base branch** - this might be a new package\n\n";
            console.log(
                "⚠️ Main bundle not found in base branch - this might be a new package"
            );
        }

        report += "---\n";
        report += `*Analysis performed on commit ${prData.commit?.substring(
            0,
            7
        )} compared to ${baseData.commit?.substring(0, 7)}*\n`;
        report += `*Generated at ${new Date().toISOString()}*\n`;

        // Write report to file
        writeFileSync(outputFile, report);

        // Also write to step summary if available (GitHub Actions)
        if (process.env.GITHUB_STEP_SUMMARY) {
            writeFileSync(process.env.GITHUB_STEP_SUMMARY, report);
        }

        console.log(`📋 Bundle comparison report saved to: ${outputFile}`);

        // Output the report content for GitHub Actions logs
        console.log("\n" + report);
    } catch (error) {
        console.error("❌ Error generating bundle report:", error);
        process.exit(1);
    }
}

// Run the main function
main().catch(error => {
    console.error("❌ Script failed:", error);
    process.exit(1);
});
