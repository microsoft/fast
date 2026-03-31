---
name: fast-bug-report
description: Generate a bug report issue for the FAST repository using the provided template.
---
This prompt only applies to generating Bug Report issues for the FAST repository.

Do not create or modify any existing Github issues. This skill is only for
generating the markdown content for a new issue based on the provided template.

Based on the conversation context, generate a bug report as a markdown code
block using the template located at
[../../ISSUE_TEMPLATE/bug-report.md](../../ISSUE_TEMPLATE/bug-report.md).

The summary should clearly state what the bug is and which part of the system
is affected.

Repro or Code Sample should provide clear, minimal steps to reproduce the issue.
Include a code snippet, repository link, or gist if possible.

Expected Behavior should describe what the correct behavior should be.

Current Behavior should explain what actually happens instead. Include the full
error message and stack trace if applicable. Mention screenshots if they would
help illustrate the problem.

Possible Solution is optional. Include it only if there is a concrete idea about
the cause or fix. Mention if the reporter is willing to contribute a fix.

Context should explain how the bug affects the user and what they are trying to
accomplish. This helps prioritize and design the right solution.

Your Environment should capture relevant details: OS, device, browser, and
package version.

Search for existing open or closed issues that overlap with this bug report.
If duplicates or related issues exist, mention them in the Context section.

Suggest a concise issue title in the format `fix: [what is the issue?] in [where is the issue?]`.

Provide the markdown code block only, without any additional commentary or explanation.

Any comments in the template can be removed since they're only meant to provide
guidance on how to fill out the template, and are not intended to be part of the
final issue body.
