---
name: documentation
description: Add documentation for contributors and developers.
---

Documentation exists in 3 forms, code comments, design/architectural documentation that is made up of markdown files describing code flow and core concepts (such as DESIGN.md), and the documentation website.

Design/architectural documentation such as DESIGN.md should always be kept up-to-date.

The website captures the documentation primarily for the `@microsoft/fast-element` package. Other packages are treated as tangential, so testing packages or other utilities should have their own sections.

The website has been written in 11ty and primarily consists of markdown files. When making changes, use the latest major version available. Version package directories omit the dot, so update `sites/website/versions/3x` for the public `/docs/3.x` content.

If you are making a breaking change, ensure the migration document has been updated.

All markdown documentation aside from the package/crate level DESIGN.md files are in that package/crates docs folder.

Any documentation created for the website should be written with the developer implementing the package in mind, it is not intended for other audiences.
