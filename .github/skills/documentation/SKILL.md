---
name: documentation
description: Add documentation for contributors and developers.
---

Documentation exists in 3 forms, code comments, design/architectural documentation that is made up of markdown files describing code flow and core concepts (such as DESIGN.md), and the documentation website.

Design/architectural documentation such as DESIGN.md should always describe the
current APIs, architecture and internals. Do not include migration instructions,
removed-API history, before/after upgrade examples or links to migration guides in
DESIGN.md.

The website captures the documentation primarily for the `@microsoft/fast-element` package. Other packages are treated as tangential, so testing packages or other utilities should have their own sections.

The website has been written in 11ty and primarily consists of markdown files. When making changes, ensure that the website has been scanned on whichever latest major version is available. These are organized by folder, so if 1.x/2.x/3.x folders are available, you will update the documentation in the 3.x folder.

## Migration guidance

For a breaking change, add or update a guide under the affected package/crate's
`docs/migration/` directory and list it in a stable `docs/migration.md` index.
Related npm packages and Rust crates may share the same migration index.

Root documents such as README.md may link to `docs/migration.md`. Other durable
documentation, including the website, should also link to the index rather than
individual per-publish guides. Keep upgrade instructions in those guides, not in
DESIGN.md.

Migration guidance is scoped to one publish, not a permanent archive. During
release preparation, review and delete guides belonging to previous publishes and
remove their index entries. Retain guidance for the publish being prepared.
Keep `docs/migration.md` even when empty, noting that there are no migrations for
the current publish, so root-document links remain valid. Cleanup is a documented
release-preparation step, not an automatic publishing action.

Keep detailed markdown documentation in the package/crate's docs folder.
DESIGN.md and root README.md files remain architectural and usage entry points.

Any documentation created for the website should be written with the developer implementing the package in mind, it is not intended for other audiences.
