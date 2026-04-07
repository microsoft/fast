# Change Log - @microsoft/fast-build

<!-- This log was last generated on Tue, 07 Apr 2026 00:50:48 GMT and should not be manually modified. -->

<!-- Start content -->

## 0.2.0

Tue, 07 Apr 2026 00:50:48 GMT

### Minor changes

- feat: convert dataset.X attribute names to data-X in SSR renderer (7559015+janechu@users.noreply.github.com)

### Patches

- fix: support .length property access on arrays in template expressions (7559015+janechu@users.noreply.github.com)
- fix: strip @event binding attributes from rendered HTML; attribute values are always strings unless a {{binding}} expression is used; property binding keys preserve their original casing (7559015+janechu@users.noreply.github.com)

## 0.1.2

Sat, 04 Apr 2026 00:22:26 GMT

### Patches

- fix: account for tags without attributes (7559015+janechu@users.noreply.github.com)

## 0.1.1

Fri, 03 Apr 2026 00:07:06 GMT

### Patches

- Parse f-template name attribute in JS locator; add DESIGN.md to @microsoft/fast-build (7559015+janechu@users.noreply.github.com)
