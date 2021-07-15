var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { spawnSync } from "child_process";
import { Octokit } from "@octokit/rest";
import { getPullRequestForCommit, repoDetails } from "./github";
const githubPAT = process.env.GITHUB_TOKEN;
if (!githubPAT && (process.argv.includes("bump") || process.argv.includes("publish"))) {
    console.warn(
        "\nGITHUB_TOKEN environment variable not found. GitHub requests may be rate-limited.\n"
    );
}
// Octokit is used to access the GitHub REST API
const github = new Octokit(
    Object.assign(
        Object.assign({}, repoDetails),
        githubPAT && { auth: "token " + githubPAT }
    )
);
const repoUrl = `https://github.com/${repoDetails.owner}/${repoDetails.repo}`;
export function renderHeader(renderInfo) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const {
            newVersionChangelog: { tag, version, date },
            previousJson,
        } = renderInfo;
        // Link to the tag on github
        const header = tag ? `[${version}](${repoUrl}/tree/${tag})` : version;
        // Also include a compare link to the previous tag if available
        const previousTag =
            (_b =
                (_a =
                    previousJson === null || previousJson === void 0
                        ? void 0
                        : previousJson.entries) === null || _a === void 0
                    ? void 0
                    : _a[0]) === null || _b === void 0
                ? void 0
                : _b.tag;
        const compareLink =
            tag && previousTag
                ? ` \n[Compare changes](${repoUrl}/compare/${previousTag}..${tag})`
                : "";
        return `## ${header}\n\n${date.toUTCString()}${compareLink}`;
    });
}
export function renderEntry(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        // Link to the PR for this changelog entry (or the commit if PR isn't found)
        const prNumber = yield _getPrNumber(entry);
        const commitLink = prNumber
            ? `[PR #${prNumber}](${repoUrl}/pull/${prNumber})`
            : `[commit](${repoUrl}/commit/${entry.commit})`;
        return `- ${entry.comment} (${commitLink} by ${entry.author})`;
    });
}
function _getPrNumber(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        // Look for (presumably) the PR number at the end of the first line of the commit
        try {
            // Get the actual commit message which should contain the PR number
            const logResult = spawnSync("git", [
                "log",
                "--pretty=format:%s",
                "-n",
                "1",
                entry.commit,
            ]);
            if (logResult.status === 0) {
                const message = logResult.stdout.toString().trim();
                const prMatch = message.split(/\r?\n/)[0].match(/\(#(\d+)\)$/m);
                if (prMatch) {
                    return Number(prMatch[1]);
                }
            }
        } catch (ex) {
            console.log(
                `Could not get commit message for ${entry.commit} to find PR number (trying another method):`,
                ex
            );
        }
        // Or fetch from GitHub API
        console.log(
            `Attempting to fetch pull request corresponding to ${entry.commit}...`
        );
        const pr = yield getPullRequestForCommit({
            commit: entry.commit,
            github,
            repoDetails: repoDetails,
        });
        if (pr) {
            console.log("...success!"); // failure message is logged by getPullRequestForCommit
            return pr.number;
        }
    });
}
