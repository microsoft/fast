# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```sh
npm ci
```

## Local Development

```sh
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server. Note that the homepage won't be displayed when developing locally. See the section "Local Serve" below to test the site in a complete build state.

## Build

```sh
npm run build
```

This command generates static content into the `build` directory and can be served using any static content hosting service.

## Local Serve

After running `npm run build`, run `npm run serve` to view the local `build` directory. This should display the homepage as well as the documentation as one complete site. Note that external links will resolve to their production routes, including the documentation site's header logo link.
