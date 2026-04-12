import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Reads a file as a UTF-8 string. Accepts bare package specifiers
 * (resolved through `package.json` exports) or filesystem paths
 * (relative to `process.cwd()`).
 *
 * @example
 * ```ts
 * import { readAsset } from "@microsoft/fast-test-harness/ssr/assets.js";
 *
 * const template = readAsset("@my-scope/button/template.html");
 * const local = readAsset("./dist/button/button.template.html");
 * ```
 *
 * @param specifier - A bare package specifier (e.g.,
 *   `"@my-scope/button/template.html"`) or a relative/absolute
 *   filesystem path.
 * @returns The file contents as a string.
 */
export function readAsset(specifier: string): string {
    return readFileSync(resolveSpecifier(specifier), "utf8");
}

/**
 * Resolves a specifier to a URL path relative to the server root.
 * The returned string starts with `/` and uses forward slashes,
 * making it suitable for `href` attributes in `<link>` or `<script>`
 * tags served by the test harness.
 *
 * @example
 * ```ts
 * import { resolveAssetUrl } from "@microsoft/fast-test-harness/ssr/assets.js";
 *
 * const styles = resolveAssetUrl("@my-scope/button/styles.css");
 * // => "/node_modules/@my-scope/button/dist/button.styles.css"
 * ```
 *
 * @param specifier - A bare package specifier or a filesystem path.
 * @param root - The directory the server serves static files from.
 *   The returned URL is relative to this directory. Defaults to
 *   `process.cwd()`.
 * @returns A root-relative URL path (e.g., `"/dist/button.styles.css"`).
 */
export function resolveAssetUrl(specifier: string, root?: string): string {
    const resolved = resolveSpecifier(specifier);
    const rel = relative(root ?? process.cwd(), resolved);
    return `/${rel.replace(/\\/g, "/")}`;
}

/**
 * Resolves a specifier to an absolute filesystem path. Relative and
 * absolute paths are joined with `process.cwd()`. Bare specifiers
 * (e.g., `"@my-scope/button/template.html"`) are resolved through
 * `import.meta.resolve`, which follows `package.json` exports maps.
 *
 * @param specifier - A bare package specifier or a filesystem path.
 * @returns An absolute filesystem path.
 */
function resolveSpecifier(specifier: string): string {
    if (specifier.startsWith(".") || specifier.startsWith("/")) {
        return join(process.cwd(), specifier);
    }
    return fileURLToPath(import.meta.resolve(specifier));
}
