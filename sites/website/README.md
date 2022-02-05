# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Installation

```sh
yarn
```

## Local Development

```sh
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server. Note that the homepage won't be displayed when developing locally. See the section "Local Serve" below to test the site in a complete build state.

## Build

```sh
yarn build
```

This command generates static content into the `build` directory and can be served using any static content hosting service.

## Local Serve

After running `yarn build`, run `yarn serve` to view the local `build` directory. This should display the homepage as well as the documentation as one complete site. Note that external links will resolve to their production routes, including the documentation site's header logo link.
