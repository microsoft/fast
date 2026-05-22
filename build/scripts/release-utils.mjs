// @ts-check
/**
 * Shared helpers for the nightly CD release workflows.
 *
 * - `cd-github-releases.yml` runs `create-github-releases.mjs` after beachball has
 *   bumped versions and packed tarballs into `publish_artifacts/`. The script
 *   creates a GitHub release per newly bumped package with the tarball as an asset.
 * - `azure-pipelines-cd.yml` runs `download-github-releases.mjs` to find GitHub
 *   releases that have not yet been published to npm and download their tarballs
 *   into `publish_artifacts/` so the downstream 1ES release template can publish
 *   them.
 *
 * No external npm dependencies — pure Node.js built-ins (fs, path, child_process,
 * https via global fetch).
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

/**
 * The folder where beachball packs tarballs (see `beachball.config.js`
 * `packToPath`). Also the folder the downstream Azure release template reads
 * from when publishing to npm.
 */
export const PUBLISH_ARTIFACTS_DIR = "publish_artifacts";

/**
 * Build the GitHub release tag for a package version. This matches the git tag
 * format that beachball creates (see beachball's `generateTag.js`:
 * `${name}_v${version}`) so that the GitHub release, the git tag, and the
 * downstream npm publish all share the same canonical identifier.
 *
 * @param {string} packageName e.g. "@microsoft/fast-element"
 * @param {string} version e.g. "2.10.4"
 * @returns {string} e.g. "@microsoft/fast-element_v2.10.4"
 */
export function makeReleaseTag(packageName, version) {
    return `${packageName}_v${version}`;
}

/**
 * Parse a beachball-style release tag back into name and version.
 *
 * @param {string} tag e.g. "@microsoft/fast-element_v2.10.4"
 * @returns {{ packageName: string, version: string } | null}
 */
export function parseReleaseTag(tag) {
    const sep = tag.lastIndexOf("_v");
    if (sep === -1) {
        return null;
    }
    const packageName = tag.slice(0, sep);
    const version = tag.slice(sep + 2);
    if (!packageName || !version) {
        return null;
    }
    return { packageName, version };
}

/**
 * Read the `package.json` from a packed npm tarball without extracting the
 * whole archive. We shell out to `tar` because it is available on every CI
 * runner we use (linux/macOS) and avoids pulling in a tar npm dependency.
 *
 * @param {string} tarballPath absolute path to the .tgz file
 * @returns {{ name: string, version: string }}
 */
export function readTarballPackageJson(tarballPath) {
    const result = spawnSync("tar", ["-O", "-xzf", tarballPath, "package/package.json"], {
        encoding: "utf8",
    });
    if (result.status !== 0) {
        throw new Error(
            `Failed to read package/package.json from ${tarballPath}: ${
                result.stderr || result.error?.message || "unknown error"
            }`,
        );
    }
    const pkg = JSON.parse(result.stdout);
    if (!pkg.name || !pkg.version) {
        throw new Error(
            `Tarball ${tarballPath} is missing name or version in package.json`,
        );
    }
    return { name: pkg.name, version: pkg.version };
}

/**
 * Enumerate `.tgz` tarballs in the `publish_artifacts/` folder relative to
 * `cwd`. Returns absolute paths sorted by filename to keep beachball's numeric
 * prefix ordering stable.
 *
 * @param {string} [cwd] working directory (defaults to process cwd)
 * @returns {Promise<string[]>}
 */
export async function listTarballs(cwd = process.cwd()) {
    const dir = resolve(cwd, PUBLISH_ARTIFACTS_DIR);
    if (!existsSync(dir)) {
        return [];
    }
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
        .filter(entry => entry.isFile() && entry.name.endsWith(".tgz"))
        .map(entry => join(dir, entry.name))
        .sort();
}

/**
 * Check whether a specific `${name}@${version}` exists in the public npm
 * registry. Uses `npm view` because it transparently respects any local npm
 * configuration (proxies, registry overrides) used by the rest of the
 * pipeline.
 *
 * @param {string} packageName
 * @param {string} version
 * @returns {boolean}
 */
export function isPublishedToNpm(packageName, version) {
    const result = spawnSync(
        "npm",
        ["view", `${packageName}@${version}`, "version", "--json"],
        { encoding: "utf8" },
    );
    if (result.status === 0) {
        const stdout = (result.stdout || "").trim();
        // Empty stdout means npm view found no matching version.
        return stdout.length > 0;
    }
    // npm view exits non-zero for "not found" (E404). Treat any other failure
    // as "not published" so the caller still attempts to publish; the
    // downstream npm publish will surface real errors.
    return false;
}

/**
 * Resolve the GitHub repository (owner/repo) the script is operating against.
 * In GitHub Actions this is provided by `GITHUB_REPOSITORY`. In Azure
 * Pipelines we accept the same variable name for symmetry; callers should
 * export it (e.g. `GITHUB_REPOSITORY: microsoft/fast`).
 *
 * @returns {{ owner: string, repo: string }}
 */
export function resolveRepository() {
    const env =
        process.env.GITHUB_REPOSITORY || process.env.GH_REPOSITORY || "microsoft/fast";
    const [owner, repo] = env.split("/");
    if (!owner || !repo) {
        throw new Error(`Invalid repository "${env}" — expected "owner/repo" format`);
    }
    return { owner, repo };
}

/**
 * Resolve the GitHub API token used to authenticate requests. Looks at the
 * usual set of environment variables.
 *
 * @returns {string}
 */
export function resolveToken() {
    const token =
        process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GH_API_TOKEN;
    if (!token) {
        throw new Error(
            "Missing GitHub token — set GITHUB_TOKEN or GH_TOKEN in the environment",
        );
    }
    return token;
}

/**
 * Issue a GitHub REST API request and parse the JSON body. Throws with a
 * helpful message on a non-2xx response.
 *
 * @param {string} url full URL or path starting with `/`
 * @param {{ token: string, method?: string, body?: unknown, headers?: Record<string, string>, accept?: string }} options
 * @returns {Promise<any>}
 */
export async function githubApi(url, options) {
    const { token, method = "GET", body, headers = {}, accept } = options;
    const fullUrl = url.startsWith("http") ? url : `https://api.github.com${url}`;
    const init = {
        method,
        headers: {
            Accept: accept || "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "fast-cd-pipeline",
            ...headers,
        },
    };
    if (body !== undefined) {
        init.body = typeof body === "string" ? body : JSON.stringify(body);
        if (!init.headers["Content-Type"]) {
            init.headers["Content-Type"] = "application/json";
        }
    }
    const response = await fetch(fullUrl, init);
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `GitHub API ${method} ${fullUrl} failed: ${response.status} ${response.statusText} ${text}`,
        );
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return response.json();
    }
    return response.text();
}

/**
 * List every release in the repository, following pagination via the `Link`
 * header. Returns the raw GitHub release objects.
 *
 * @param {{ token: string, owner: string, repo: string }} options
 * @returns {Promise<Array<any>>}
 */
export async function listAllReleases({ token, owner, repo }) {
    const releases = [];
    let url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`;
    while (url) {
        const response = await fetch(url, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${token}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "fast-cd-pipeline",
            },
        });
        if (!response.ok) {
            const text = await response.text().catch(() => "");
            throw new Error(
                `Failed to list releases: ${response.status} ${response.statusText} ${text}`,
            );
        }
        const page = await response.json();
        releases.push(...page);
        url = parseNextLink(response.headers.get("link"));
    }
    return releases;
}

/**
 * Extract the `rel="next"` URL from a GitHub `Link` header, if any.
 *
 * @param {string | null} header
 * @returns {string | null}
 */
function parseNextLink(header) {
    if (!header) {
        return null;
    }
    const parts = header.split(",");
    for (const part of parts) {
        const match = part.match(/<([^>]+)>;\s*rel="next"/);
        if (match) {
            return match[1];
        }
    }
    return null;
}

/**
 * Get the existing release (if any) for a given tag. Returns `null` when the
 * release does not exist.
 *
 * @param {{ token: string, owner: string, repo: string, tag: string }} options
 * @returns {Promise<any | null>}
 */
export async function getReleaseByTag({ token, owner, repo, tag }) {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${token}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "fast-cd-pipeline",
            },
        },
    );
    if (response.status === 404) {
        return null;
    }
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `Failed to look up release ${tag}: ${response.status} ${response.statusText} ${text}`,
        );
    }
    return response.json();
}

/**
 * Create a new GitHub release.
 *
 * @param {{ token: string, owner: string, repo: string, tag: string, name: string, body: string }} options
 * @returns {Promise<any>}
 */
export async function createRelease({ token, owner, repo, tag, name, body }) {
    return githubApi(`/repos/${owner}/${repo}/releases`, {
        token,
        method: "POST",
        body: {
            tag_name: tag,
            name,
            body,
            draft: false,
            prerelease: /-(alpha|beta|rc|next|canary)/i.test(tag),
        },
    });
}

/**
 * Upload an asset to an existing release. GitHub uses a separate `uploads`
 * host for asset uploads.
 *
 * @param {{ token: string, uploadUrl: string, filePath: string, fileName: string }} options
 * @returns {Promise<any>}
 */
export async function uploadReleaseAsset({ token, uploadUrl, filePath, fileName }) {
    // The upload URL returned by the create-release API has a `{?name,label}`
    // suffix we need to strip.
    const cleanUrl = uploadUrl.replace(/\{\?[^}]+\}$/, "");
    const data = await readFile(filePath);
    const response = await fetch(`${cleanUrl}?name=${encodeURIComponent(fileName)}`, {
        method: "POST",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/gzip",
            "Content-Length": String(data.byteLength),
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "fast-cd-pipeline",
        },
        body: data,
    });
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `Failed to upload asset ${fileName}: ${response.status} ${response.statusText} ${text}`,
        );
    }
    return response.json();
}

/**
 * Download a release asset to a local file. Uses the asset's `id` and the
 * `application/octet-stream` media type which is required to get raw bytes.
 *
 * @param {{ token: string, owner: string, repo: string, assetId: number, destPath: string }} options
 * @returns {Promise<void>}
 */
export async function downloadReleaseAsset({ token, owner, repo, assetId, destPath }) {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases/assets/${assetId}`,
        {
            headers: {
                Accept: "application/octet-stream",
                Authorization: `Bearer ${token}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "fast-cd-pipeline",
            },
            redirect: "follow",
        },
    );
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `Failed to download asset ${assetId}: ${response.status} ${response.statusText} ${text}`,
        );
    }
    await mkdir(dirname(destPath), { recursive: true });
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(destPath, buffer);
}
