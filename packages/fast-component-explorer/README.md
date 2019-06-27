# Introduction

This is the documentation site for `@microsoft/fast-components-react-msft`.

It is built using the `@microsoft/fast-tooling-react` and `@microsoft/fast-components-react-msft` packages and shows the components in a playground as well as the documentation for each component.

## Getting Started
Follow setup instructions in [contributing](https://github.com/Microsoft/fast-dna/blob/master/CONTRIBUTING.md).

- Running the app locally: `npm start`
- Build production app: `npm run build`

## Testing
- Run all tests: `npm test`
- tslint all files: `npm run tslint`

## Troubleshooting
- The application uses service-workers, which means views might not update as expected during the development process. To ensure files are updated when changed, you can configure your developer tools to [update the assets on reload](https://stackoverflow.com/questions/40783790/disable-service-workers-when-in-development-mode).

## Contributing components

If you are adding a component to the documentation site, you will need to:

- Add curated component configs to the `./app/utilities/configs/` folder. See the `./app/utilities/configs/README.md` for details.
