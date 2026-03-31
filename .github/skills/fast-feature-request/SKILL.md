---
name: fast-feature-request
description: Generate a feature request issue for the FAST repository using the provided template.
---
This prompt only applies to generating Feature Request issues for the FAST repository.

Do not create or modify any existing Github issues. This skill is only for
generating the markdown content for a new issue based on the provided template.

Based on the conversation context, generate a feature request as a markdown code
block using the template located at
[../../ISSUE_TEMPLATE/feature-request.md](../../ISSUE_TEMPLATE/feature-request.md).

The summary should clearly state what the feature is and why it matters, focusing
on user value rather than implementation details.

Expected Behavior should describe how the feature would work from an end-user or
developer perspective. Be specific about the desired outcome.

Current Behavior should explain the gap — what exists today and how the absence of
this feature affects users. If there is a workaround, mention it briefly.

Possible Solution is optional. Include it only if there is a concrete implementation
idea worth capturing. Prefer high-level direction over prescriptive code.

Context should explain the motivation — what the user is trying to accomplish
and why this feature would help. Mention alternatives that were considered, if any.

Examples is optional. Include it when code snippets, screenshots, or usage
scenarios would clarify the request.

Search for existing open or closed issues that overlap with this feature request.
If duplicates or related issues exist, mention them in the Context section.

Suggest a concise issue title in the format `feat: add [what] to/in [where]`.

Provide the markdown code block only, without any additional commentary or explanation.

Any comments in the template can be removed since they're only meant to provide
guidance on how to fill out the template, and are not intended to be part of the
final issue body.
