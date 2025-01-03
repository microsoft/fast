module.exports = {
    changelog: {
        customRenderers: {
            // Original template: https://github.com/microsoft/beachball/blob/aefbc1ac37ee85961cc787133c827f1fd3925550/src/changelog/renderPackageChangelog.ts#L93
            renderEntry: entry => {
                if (entry.author === 'beachball') {
                    return `- ${entry.comment}`;
                  }
                  // Imitate GitHub's commit format https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls#commit-shas
                  return `- ${entry.comment} ([ni/fast@${entry.commit.substring(0,7)}](https://github.com/ni/fast/commit/${entry.commit}))`;
            }
        }
    }
};
