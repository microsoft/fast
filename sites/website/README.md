# Website

This website is built using [11ty](https://www.11ty.dev/), a modern static website generator.

## Installation

Run the following commands in the **root directory**:

```sh
npm ci
npm run build
```

## Local Development

```sh
npm start
```

## Build

```sh
npm run build
```

This command generates static content into the `build` directory and can be served using any static content hosting service.

## Version Banners

The site supports configurable banners on documentation pages to communicate version status (e.g., prerelease, legacy). Banners are defined in `src/_data/versionBanners.js` and rendered via `src/_includes/version-banner.njk`.

### Configuration

Edit `src/_data/versionBanners.js` to add, remove, or modify banners. Each version key maps to a configuration object:

```js
"3.x": {
    enabled: true,              // Toggle the banner on/off
    type: "prerelease",         // "legacy" | "stable" | "prerelease"
    version: fastElementVersion, // Optional version string
    message: "This is a prerelease version of FAST (3.0.0-rc.1).",
}
```

| Type | Color | Use case |
|------|-------|----------|
| `legacy` | Gray | Previous versions — links to latest docs |
| `stable` | Green | Current stable release |
| `prerelease` | Amber | Upcoming / release candidate versions |

The prerelease banner reads the version from `@microsoft/fast-element`'s `package.json` automatically.

### Styles

Banner CSS lives in `src/css/version-banner.css` and is loaded on all pages via `root.njk`.
