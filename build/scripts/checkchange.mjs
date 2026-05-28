#!/usr/bin/env node
/**
 * Wrapper around `beachball check` for the `checkchange` npm script.
 *
 * Background
 * ----------
 * Beachball requires a [change file](https://microsoft.github.io/beachball/concepts/change-files.html)
 * for ANY edit to a publishable workspace's `package.json` — including
 * a hand-written `version` bump. That is the desired default for the
 * broad contributor population, but a small set of maintainer-driven
 * flows legitimately produce package.json edits without a change file:
 *
 *   - Hotfix overrides where the bump is the entire change.
 *   - Paired Rust-crate / npm-package version sync recovery.
 *   - Renovate-style or scripted version pins on a dedicated branch.
 *
 * Authorizing the bypass
 * ----------------------
 * To avoid weakening the check for the broad contributor population,
 * `checkchange` skips beachball entirely ONLY when BOTH of the
 * following are true:
 *
 *   1. The current branch name matches beachball's documented publish
 *      branch convention (`publish_<timestamp>`, generated as
 *      `'publish_' + String(new Date().getTime())` in
 *      `beachball/lib/commands/publish.js`). Matching pattern:
 *      `/^publish_\d+$/`.
 *
 *   2. The actor has the `admin` role on `microsoft/fast`, verified
 *      live via the GitHub REST API:
 *      `GET /repos/microsoft/fast/collaborators/<login>/permission`.
 *      The actor login is read from `$GITHUB_ACTOR` in CI and falls
 *      back to `gh api user --jq .login` for local runs. The API
 *      token is read from `$GITHUB_TOKEN` → `$GH_TOKEN` →
 *      `gh auth token` in order.
 *
 * Both conditions must hold. Maintainership lives in the GitHub repo
 * settings (no hardcoded login list to keep in sync), and a publishable
 * branch alone — without admin role — gets the normal change-file
 * requirement.
 *
 * Fail-closed
 * -----------
 * Every short-circuit before the bypass (no token, no login, network
 * error, non-admin role) falls through to `beachball check`. The
 * bypass is only granted when the API responds with `"admin"`.
 *
 * Every bypass writes a loud banner to stdout naming the branch, the
 * actor, and the role so a reviewer scanning CI logs can spot it.
 *
 * See `CONTRIBUTING.md` ("Manual version bumps") for the maintainer
 * workflow and the rationale behind each guard.
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const REPO = "microsoft/fast";
const REQUIRED_ROLE = "admin";
const PUBLISH_BRANCH_RE = /^publish_\d+$/;
const API_TIMEOUT_MS = 5000;

function git(args) {
    const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
    if (result.status !== 0) {
        return "";
    }
    return result.stdout.trim();
}

function ghCli(args) {
    const result = spawnSync("gh", args, { cwd: repoRoot, encoding: "utf8" });
    if (result.status !== 0) {
        return "";
    }
    return result.stdout.trim();
}

function getBranchName() {
    const headRef = process.env.GITHUB_HEAD_REF;
    if (headRef && headRef.trim() !== "") {
        return { value: headRef.trim(), source: "GITHUB_HEAD_REF" };
    }
    const refName = process.env.GITHUB_REF_NAME;
    if (refName && refName.trim() !== "") {
        return { value: refName.trim(), source: "GITHUB_REF_NAME" };
    }
    const local = git(["rev-parse", "--abbrev-ref", "HEAD"]);
    return { value: local, source: "git" };
}

function getActorLogin() {
    const actor = process.env.GITHUB_ACTOR;
    if (actor && actor.trim() !== "") {
        return { value: actor.trim(), source: "GITHUB_ACTOR" };
    }
    const login = ghCli(["api", "user", "--jq", ".login"]);
    if (login) {
        return { value: login, source: "gh api user" };
    }
    return { value: null, source: null };
}

function getToken() {
    if (process.env.GITHUB_TOKEN) {
        return { value: process.env.GITHUB_TOKEN, source: "GITHUB_TOKEN" };
    }
    if (process.env.GH_TOKEN) {
        return { value: process.env.GH_TOKEN, source: "GH_TOKEN" };
    }
    const token = ghCli(["auth", "token"]);
    if (token) {
        return { value: token, source: "gh auth token" };
    }
    return { value: null, source: null };
}

async function fetchPermission(login, token) {
    const url = `https://api.github.com/repos/${REPO}/collaborators/${encodeURIComponent(login)}/permission`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "fast-checkchange",
            },
            signal: controller.signal,
        });
        if (!res.ok) {
            return { permission: null, error: `HTTP ${res.status} ${res.statusText}` };
        }
        const body = await res.json();
        return { permission: body.permission ?? null, error: null };
    } catch (err) {
        return { permission: null, error: err.message || String(err) };
    } finally {
        clearTimeout(timeoutId);
    }
}

function logBypassBanner({ branch, actor, permission }) {
    const lines = [
        "",
        "================================================================",
        "[checkchange] BYPASS: skipping `beachball check` for this run.",
        "----------------------------------------------------------------",
        `  branch    : ${branch.value}    (source: ${branch.source})`,
        `  actor     : ${actor.value}    (source: ${actor.source})`,
        `  role      : ${permission}    (source: GitHub API ${REPO})`,
        "",
        "  Reason: branch matches beachball's `publish_<timestamp>`",
        `  convention AND actor has the '${REQUIRED_ROLE}' role on ${REPO}.`,
        "",
        "  No change file is required for this PR. If this bypass is",
        "  unexpected (e.g. the branch contains real source changes",
        "  rather than a version bump), close the PR or rename the",
        "  branch to remove the `publish_` prefix and push again.",
        "",
        "  See CONTRIBUTING.md > 'Manual version bumps' for context.",
        "================================================================",
        "",
    ];
    for (const line of lines) {
        console.log(line);
    }
}

function runBeachballCheck(passThroughArgs) {
    const args = [
        "beachball",
        "check",
        "--scope",
        "!sites/*",
        "--changehint",
        "Run 'npm run change' to generate a change file",
        ...passThroughArgs,
    ];
    const result = spawnSync("npx", args, {
        cwd: repoRoot,
        stdio: "inherit",
    });
    if (result.error) {
        console.error("[checkchange] Failed to execute beachball:", result.error.message);
        process.exit(1);
    }
    process.exit(result.status ?? 1);
}

async function main() {
    const passThroughArgs = process.argv.slice(2);
    const branch = getBranchName();

    if (!PUBLISH_BRANCH_RE.test(branch.value)) {
        runBeachballCheck(passThroughArgs);
        return;
    }

    const actor = getActorLogin();
    if (!actor.value) {
        console.warn(
            "[checkchange] Branch matches `publish_<timestamp>` but the " +
                "actor login could not be determined (no $GITHUB_ACTOR and " +
                "`gh api user` failed). Falling through to `beachball check`.",
        );
        runBeachballCheck(passThroughArgs);
        return;
    }

    const token = getToken();
    if (!token.value) {
        console.warn(
            "[checkchange] Branch matches `publish_<timestamp>` and actor " +
                `is '${actor.value}', but no GitHub token is available ` +
                "(set $GITHUB_TOKEN, $GH_TOKEN, or authenticate with " +
                "`gh auth login`). Falling through to `beachball check`.",
        );
        runBeachballCheck(passThroughArgs);
        return;
    }

    const { permission, error } = await fetchPermission(actor.value, token.value);
    if (error) {
        console.warn(
            `[checkchange] Could not verify '${actor.value}' role on ` +
                `${REPO} via GitHub API (${error}; token source: ` +
                `${token.source}). Falling through to \`beachball check\`.`,
        );
        runBeachballCheck(passThroughArgs);
        return;
    }

    if (permission !== REQUIRED_ROLE) {
        console.log(
            `[checkchange] Branch matches \`publish_<timestamp>\` but ` +
                `actor '${actor.value}' has role '${permission ?? "none"}' ` +
                `on ${REPO} (required: '${REQUIRED_ROLE}'). Falling ` +
                "through to `beachball check`.",
        );
        runBeachballCheck(passThroughArgs);
        return;
    }

    logBypassBanner({ branch, actor, permission });
    process.exit(0);
}

main().catch(err => {
    console.error("[checkchange] Unexpected error:", err);
    process.exit(1);
});
