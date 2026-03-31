---
name: fast-pull-request
description: Generate a pull request description for the FAST repository using the provided template.
---
This skill only applies to generating Pull Request descriptions for the FAST repository.

Do not create or modify any existing Github pull requests. This skill is only for
generating the markdown content for a pull request description based on the provided template.

Based on the conversation context, generate a pull request description as a markdown code
block using the template located at
[../../pull_request_template.md](../../pull_request_template.md).

Use the Pull Request Template to generate a markdown code block for the most
relevant work on this git branch, compared to `main`.

The Description should be either a summary description of the content of the branch,
or a list of the most relevant changes made in the branch. The goal is to address
the purpose of the pull request in a concise manner, rather than detailing every change. "Why"
and "what" over "how".

Determine if any current github issues are being addressed by this work, and
list them in the Issues section with links. If none are found, remove the Issues section.

The reviewer notes section is optional. Include it only if there are specific
areas where you would like feedback or attention from the reviewer.

The Test Plan section should outline any issues that need to be verified before merging,
or steps to reproduce the behavior locally. Even a brief note is helpful, such as "All existing tests pass".

The checklist section should be completed to indicate the status of various
aspects of the pull request.

If there are change files that have been added to the PR, check the box labeled "I have included a change request file using `$ npm run change`".

If any new tests have been added, check the box labeled "I have added tests for my changes."

Check the terminal output for evidence of passing tests, and check the box labeled "I have tested my changes." if tests have been run and are passing. If not, leave the box unchecked.

If any doc blocks have been added or modified, or if any documentation files have been added or modified, check the box labeled "I have updated the project documentation to reflect my changes." This also applies to any changes made to api-report files.

The final checkbox must be checked by the pull request author. It should never be checked when generating this PR description.

The Next Steps section is optional. Include it only if there are specific follow-up tasks
or work items that should be addressed after merging this PR, such as updating documentation, adding new tests, or performing code cleanup. If any existing issues are being addressed by the next steps, reference them here.

Provide the markdown code block only, without any additional commentary or explanation.

Any comments in the template can be removed since they're only meant to provide
guidance on how to fill out the template, and are not intended to be part of the
final PR description.
