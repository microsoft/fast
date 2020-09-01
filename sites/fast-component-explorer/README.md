# Introduction

This is the documentation site for `@microsoft/fast-components-react-msft`.

It is built using the `@microsoft/fast-tooling-react` and `@microsoft/fast-components-react-msft` packages to view, configure, and document each component.

## Getting Started
Follow setup instructions in [contributing](https://github.com/Microsoft/fast/blob/master/CONTRIBUTING.md).

- Running the app locally: `yarn start`
- Build production app: `yarn build`

## Testing
- Run all tests: `yarn test`
- eslint all files: `yarn eslint`

## Troubleshooting
- The application uses service-workers, which means views might not update as expected during the development process. To ensure files are updated when changed, you can configure your developer tools to [update the assets on reload](https://stackoverflow.com/questions/40783790/disable-service-workers-when-in-development-mode).

## Contributing components

If you are adding a component to the documentation site, you will need to:

- Add curated component configs to the `./app/utilities/configs/` folder. See the `./app/utilities/configs/README.md` for details.
- If your component includes a plugin, add any plugin ids and custom plugins to the `./app/utilities/plugins/` folder. For more information on how plugins work, read the [documentation](https://github.com/microsoft/fast/blob/master/packages/fast-tooling-react/README.md) for the `@microsoft/fast-tooling-react` package.
- If a scenario is added to a components config that uses other components as children, those children components must first be added to the `./app/utilities/configs` (published components) or `./app/utilities/components` (test components for demonstration purposes)
