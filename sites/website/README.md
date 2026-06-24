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
