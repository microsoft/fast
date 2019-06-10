# FAST Storybook presets
A [Storybook preset](https://storybook.js.org/docs/presets/introduction/) to bring consistency across FAST storybook implementations.

## Installation
`npm i @microsoft/fast-storybook-presets`

## Usage
In your projects `.storybook` directory, add `.storybook/presets.js` if it does not already exist. Then add `@microsoft/fast-storybook-presets` to the exported preset array:

```js
module.exports = ["@microsoft/fast-storybook-presets"];
```

See [preset documentation](https://storybook.js.org/docs/presets/introduction/) for more details on adding [Storybook](https://storybook.js.org) presets.
