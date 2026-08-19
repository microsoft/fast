# Website

The private `@microsoft/fast-site` package is the shared shell for the versioned FAST
documentation website. It is built using [11ty](https://www.11ty.dev/).

The packages under `../versions/{1x,2x,3x}` own their documentation sources and publish
at `/docs/{1.x,2.x,3.x}`. A full build copies the shared source in `src` and each
version package's `src` directory into `tmp/src`. API documentation is generated only
in the staged 3.x tree, so version package sources are not modified.

## Installation

Run the following commands in the **root directory**:

```sh
npm ci
npm run build -w @microsoft/fast-site
```

## Local Development

```sh
npm run start -w @microsoft/fast-site
```

The development server watches the shared source and all version package sources. Changes
under `../versions/{1x,2x,3x}/src` are synchronized into the staging tree before the
browser reloads.

## Build

```sh
npm run build -w @microsoft/fast-site
```

This command generates static content into `sites/website/docs/build`. The version
packages retain the public URL structure `/docs/1.x`, `/docs/2.x`, and `/docs/3.x`.

Each version can also be built independently:

```sh
npm run build -w @microsoft/fast-site-1x
npm run build -w @microsoft/fast-site-2x
npm run build -w @microsoft/fast-site-3x
```

These commands write only the corresponding `build/docs/{public-version}` subtree in
the version workspace. They reuse this package's Eleventy configuration, layouts, and
scripts without modifying tracked source files.

## Version Banners

The site supports configurable banners on documentation pages to communicate version status (e.g., stable, legacy, prerelease). Banners are defined in `src/_data/versionBanners.js` and rendered via `src/_includes/version-banner.njk`.

### Configuration

Edit `src/_data/versionBanners.js` to add, remove, or modify banners. Each version key maps to a configuration object:

```js
"3.x": {
    enabled: false,             // Toggle the banner on/off
    type: "stable",             // "legacy" | "stable" | "prerelease"
    message: "You are viewing the current stable version of FAST.",
}
```

| Type | Color | Use case |
|------|-------|----------|
| `legacy` | Gray | Previous versions — links to latest docs |
| `stable` | Green | Current stable release |
| `prerelease` | Amber | Upcoming / release candidate versions |

Prerelease banners should include any version-specific copy directly in the message.

### Styles

Banner CSS lives in `src/css/version-banner.css` and is loaded on all pages via `root.njk`.
