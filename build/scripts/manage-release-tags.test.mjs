import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
    createReleaseTagManager,
    gitResult,
    validateReleaseCommit,
} from "./manage-release-tags.mjs";
import { parseReleaseTagCsv } from "./release-tag-csv.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const scriptPath = join(repoRoot, "build", "scripts", "manage-release-tags.mjs");
const releaseTag = "@microsoft/fast-element_v2.0.0";
let fixtureId = 0;

function git(cwd, args) {
    return execFileSync("git", cwd.endsWith(".git") ? ["--git-dir=.", ...args] : args, {
        cwd,
        encoding: "utf8",
    }).trim();
}

function withGitHarness(run) {
    const root = join(
        repoRoot,
        `.manage-release-tags-test-${process.pid}-${fixtureId++}`,
    );
    const origin = join(root, "origin.git");
    const seed = join(root, "seed");
    const work = join(root, "work");
    mkdirSync(root);

    try {
        git(root, ["init", "--bare", origin]);
        git(root, ["init", seed]);
        git(seed, ["config", "user.name", "Test Author"]);
        git(seed, ["config", "user.email", "test@example.com"]);
        writeFileSync(join(seed, "file.txt"), "first\n");
        git(seed, ["add", "file.txt"]);
        git(seed, ["commit", "-m", "first"]);
        git(seed, ["branch", "-M", "main"]);
        git(seed, ["remote", "add", "origin", origin]);
        git(seed, ["push", "-u", "origin", "main"]);
        git(origin, ["symbolic-ref", "HEAD", "refs/heads/main"]);
        git(root, ["clone", "--no-tags", `file://${origin}`, work]);

        return run({
            commit: git(seed, ["rev-parse", "HEAD"]),
            origin,
            seed,
            work,
        });
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
}

function remotePeeledCommit(origin, tag) {
    return git(origin, ["rev-parse", `refs/tags/${tag}^{commit}`]);
}

test("strict release tag CSV parsing validates shape and duplicates", () => {
    assert.deepEqual(parseReleaseTagCsv(releaseTag), [releaseTag]);
    assert.throws(() => parseReleaseTagCsv(""), /required.*non-empty string/);
    assert.throws(() => parseReleaseTagCsv(`${releaseTag}, ${releaseTag}`), /whitespace/);
    assert.throws(() => parseReleaseTagCsv(`${releaseTag},`), /empty tags/);
    assert.throws(() => parseReleaseTagCsv("not-a-tag"), /malformed release tags/);
    assert.throws(
        () => parseReleaseTagCsv(`${releaseTag},${releaseTag}`),
        /duplicate release tags/,
    );
});

test("release commit validation fails closed", () => {
    assert.equal(validateReleaseCommit("a".repeat(40)), "a".repeat(40));
    assert.throws(() => validateReleaseCommit("abc"), /full lowercase/);
    assert.throws(() => validateReleaseCommit("A".repeat(40)), /full lowercase/);
});

test("tag manager rejects invalid tag arrays before running git", () => {
    const manager = createReleaseTagManager({
        execute() {
            throw new Error("git must not run for invalid input");
        },
    });
    const commit = "a".repeat(40);
    assert.throws(() => manager.create([], commit), /non-empty array/);
    assert.throws(() => manager.create(["not-a-tag"], commit), /Invalid release tags/);
    assert.throws(
        () => manager.markDeployed([releaseTag, releaseTag], commit),
        /duplicate/,
    );
});

test("create and mark-deployed are isolated and idempotent", () => {
    withGitHarness(({ commit, origin, work }) => {
        const logs = [];
        const manager = createReleaseTagManager({
            cwd: work,
            log: message => logs.push(message),
            now: () => new Date("2026-08-12T00:00:00Z"),
        });

        manager.create([releaseTag], commit);
        assert.equal(git(origin, ["cat-file", "-t", `refs/tags/${releaseTag}`]), "tag");
        assert.equal(remotePeeledCommit(origin, releaseTag), commit);
        assert.equal(git(work, ["tag", "--list"]), "");

        manager.create([releaseTag], commit);
        assert.match(logs.at(-1), /already points to/);

        manager.markDeployed([releaseTag], commit);
        assert.equal(
            git(origin, ["cat-file", "-t", `refs/tags/deployed/${releaseTag}`]),
            "commit",
        );
        manager.markDeployed([releaseTag], commit);
        assert.match(logs.at(-1), /already marks the expected release/);
        assert.equal(git(work, ["tag", "--list"]), "");
    });
});

test("tag creation and deployment markers accept same-commit push races", () => {
    withGitHarness(({ commit, seed, work }) => {
        let racedCreate = false;
        const createManager = createReleaseTagManager({
            cwd: work,
            execute(args, options) {
                if (!racedCreate && args[0] === "push") {
                    racedCreate = true;
                    git(seed, [
                        "tag",
                        "-a",
                        releaseTag,
                        commit,
                        "-m",
                        `Concurrent ${releaseTag}`,
                    ]);
                    git(seed, ["push", "origin", `refs/tags/${releaseTag}`]);
                }
                return gitResult(args, { cwd: work, ...options });
            },
        });
        assert.doesNotThrow(() => createManager.create([releaseTag], commit));

        let racedMarker = false;
        const markerManager = createReleaseTagManager({
            cwd: work,
            execute(args, options) {
                if (!racedMarker && args[0] === "push") {
                    racedMarker = true;
                    git(seed, ["tag", `deployed/${releaseTag}`, commit]);
                    git(seed, ["push", "origin", `refs/tags/deployed/${releaseTag}`]);
                }
                return gitResult(args, { cwd: work, ...options });
            },
        });
        assert.doesNotThrow(() => markerManager.markDeployed([releaseTag], commit));
    });
});

test("tag manager rejects conflicting remote tags and markers", () => {
    withGitHarness(({ commit, seed, work }) => {
        writeFileSync(join(seed, "file.txt"), "second\n");
        git(seed, ["commit", "-am", "second"]);
        const otherCommit = git(seed, ["rev-parse", "HEAD"]);
        git(seed, ["tag", "-a", releaseTag, otherCommit, "-m", "wrong release"]);
        git(seed, ["push", "origin", `refs/tags/${releaseTag}`]);

        const manager = createReleaseTagManager({ cwd: work });
        assert.throws(
            () => manager.create([releaseTag], commit),
            new RegExp(`${releaseTag.replaceAll(".", "\\.")} points to ${otherCommit}`),
        );
        assert.throws(
            () => manager.markDeployed([releaseTag], commit),
            new RegExp(`${releaseTag.replaceAll(".", "\\.")} points to ${otherCommit}`),
        );
    });
});

test("CLI rejects missing commands and invalid environment input", () => {
    const invoke = (args, env = {}) =>
        spawnSync(process.execPath, [scriptPath, ...args], {
            cwd: repoRoot,
            encoding: "utf8",
            env: { PATH: process.env.PATH, ...env },
        });

    const missingCommand = invoke([]);
    assert.equal(missingCommand.status, 1);
    assert.match(missingCommand.stderr, /Usage:/);

    const missingCommit = invoke(["create"], { RELEASE_TAGS: releaseTag });
    assert.equal(missingCommit.status, 1);
    assert.match(missingCommit.stderr, /RELEASE_COMMIT/);

    const invalidTags = invoke(["create"], {
        RELEASE_COMMIT: "a".repeat(40),
        RELEASE_TAGS: "not-a-tag",
    });
    assert.equal(invalidTags.status, 1);
    assert.match(invalidTags.stderr, /malformed release tags/);
});
