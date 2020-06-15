# FAST Components

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-components.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-components)

`fast-components` is a library of Web Components that *composes* the exports of `fast-foundation` with stylesheets aligning to the FAST design language. This composition step registers a custom element. See the [quick start](http://fast.design/fast-foundation/getting-started) to get stared using the components.

## Installation

`npm i --save @microsoft/fast-components`

## Development

To start the component development environment, run `yarn start`.

### Known issue with Storybook site hot-reloading

Storybook will watch modules for changes and hot-reload the module when necessary. This is usually great but poses a problem when the module being hot-reloaded defines a custom element. A custom element name can only be defined by the `CustomElementsRegistry` once, so reloading a module that defines a custom element will attempt to re-register the custom element name, throwing an error because the name has already been defined. This error will manifest with the following message:
`Failed to execute 'define' on 'CustomElementRegistry': the name "my-custom-element-name" has already been used with this registry`

This is a known issue and will indicate that you need to refresh the page. We're working on surfacing a more instructive error message for this case.
