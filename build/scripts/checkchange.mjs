#!/usr/bin/env node
/**
 * Wrapper around `beachball check` for the `checkchange` npm script.
 *
 * Background
 * ----------
 * Beachball requires a [change file](https://microsoft.github.io/beachball/concepts/change-files.html)
 * for ANY edit to a publishable workspace's `package.json` — including
 * a hand-written `version` bump. That is the desired default for normal
 * feature/fix PRs, but a small set of maintainer-driven flows
 * legitimately produce package.json edits without a change file:
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
 *   2. The workflow actor (`$GITHUB_ACTOR`) or, locally, the HEAD
 *      commit author email, is on a short allowlist of maintainers
 *      who routinely own the release / hotfix flow.
 *
 * Both conditions must hold. A contributor who renames their branch to
 * `publish_1234567890` but is not on the allowlist gets the normal
 * change-file requirement; an allowlisted maintainer working on a
 * regular feature branch also gets the normal requirement. The bypass
 * is a deliberate, opt-in convention — not an implicit perk of
 * maintainer status.
 *
 * Every bypass writes a loud banner to stdout naming the branch,
 * actor, and event source so a reviewer scanning CI logs can spot it.
 *
 * See `CONTRIBUTING.md` ("Manual version bumps") for the maintainer
 * workflow and the rationale behind each guard.
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const ALLOWED_LOGINS = new Set(["janechu", "chrisdholt"]);

const ALLOWED_EMAILS = new Set([
    "7559015+janechu@users.noreply.github.com",
    "13071055+chrisdholt@users.noreply.github.com",
    "chhol@microsoft.com",
]);

const PUBLISH_BRANCH_RE = /^publish_\d+$/;

function git(args) {
    const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
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

function getActorIdentity() {
    const actor = process.env.GITHUB_ACTOR;
    if (actor && actor.trim() !== "") {
        return { value: actor.trim(), kind: "login", source: "GITHUB_ACTOR" };
    }
    const email = git(["log", "-1", "--format=%ae", "HEAD"]);
    return { value: email, kind: "email", source: "git" };
}

function isAllowedActor(actor) {
    if (!actor.value) return false;
    if (actor.kind === "login") return ALLOWED_LOGINS.has(actor.value);
    if (actor.kind === "email") return ALLOWED_EMAILS.has(actor.value);
    return false;
}

function logBypassBanner({ branch, actor }) {
    const lines = [
        "",
        "================================================================",
        "[checkchange] BYPASS: skipping `beachball check` for this run.",
        "----------------------------------------------------------------",
        `  branch          : ${branch.value}    (source: ${branch.source})`,
        `  actor (${actor.kind.padEnd(5)}) : ${actor.value}    (source: ${actor.source})`,
        "",
        "  Reason: branch matches beachball's `publish_<timestamp>`",
        "  convention AND actor is on the manual-bump allowlist in",
        "  build/scripts/checkchange.mjs.",
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

function main() {
    const passThroughArgs = process.argv.slice(2);
    const branch = getBranchName();
    const actor = getActorIdentity();

    const branchMatches = PUBLISH_BRANCH_RE.test(branch.value);
    const actorAllowed = isAllowedActor(actor);

    if (branchMatches && actorAllowed) {
        logBypassBanner({ branch, actor });
        process.exit(0);
    }

    runBeachballCheck(passThroughArgs);
}

main();
