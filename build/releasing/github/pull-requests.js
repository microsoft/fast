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
/**
 * Get the pull request info corresponding to the given commit.
 * (The `author.email` property is only present if `authorEmail` is provided.)
 */
export function getPullRequestForCommit(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { github, repoDetails, commit, authorEmail, verbose } = params;
        verbose && console.log(`Looking for the PR containing ${commit}...`);
        try {
            // Attempt to directly find the PR corresponding to the commit from the change file
            const result = yield github.repos.listPullRequestsAssociatedWithCommit(
                Object.assign({ commit_sha: commit }, repoDetails)
            );
            // Filter out unmerged PRs, in case the commit has been in multiple PRs but only one got merged
            // (check merged_at because that's only set if the PR has been merged, whereas merge_commit_sha
            // is set even for un-merged PRs, to the most recent intermediate merge)
            const prs = result.data.filter(result => !!result.merged_at);
            if (prs.length > 1) {
                // In case the commit was in PRs to multiple branches or something?
                console.warn(`Multiple PRs found for ${commit}:`);
                console.warn(prs.map(pr => `  ${pr.url}`).join("\n"));
            }
            if (prs[0]) {
                verbose && console.log(`Found matching PR #${prs[0].number}.\n`);
                return processPullRequestApiResponse(prs[0], authorEmail);
            }
        } catch (ex) {
            console.warn(`Error finding PR for ${commit}`, ex);
            return;
        }
        console.warn(`Could not find a PR matching ${commit}.`);
    });
}
/**
 * Convert a GitHub API response to an IPullRequest.
 * The `author.email` property is only present if `authorEmail` is provided.
 */
export function processPullRequestApiResponse(pr, authorEmail) {
    return {
        number: pr.number,
        url: pr.html_url,
        author: {
            email: authorEmail,
            username: pr.user.login,
            url: pr.user.html_url,
        },
    };
}
