# Introduction 
Application for UI testing and development.

## Getting Started
Follow setup instructions in (https://github.com/Microsoft/fast/blob/master/CONTRIBUTING.md)(https://github.com/Microsoft/fast/blob/master/CONTRIBUTING.md)

- Running the app locally: `yarn start`
- Build production app: `yarn build`

## Testing
- Run all tests: `yarn test`
- eslint all files: `yarn eslint`

## Troubleshooting
- The application uses service-workers, which means views might not update as expected during the development process. To ensure files are updated when changed, you can configure your developer tools to update the assets on reload: (https://stackoverflow.com/questions/40783790/disable-service-workers-when-in-development-mode).