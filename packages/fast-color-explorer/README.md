# Introduction 
Application for UI testing and development.

# Getting Started
Clone the repository, and then run `npm i` in the root directory.

- Running the app locally: `npm start`
- Build production app: `npm run build`

# Testing
- Run all tests: `npm test`
- Run unit tests: `npm run unit-tests`
- tslint all files: `npm run tslint`

# Troubleshooting
- The application uses service-workers, which means views might not update as expected during the development process. To ensure files are updated when changed, you can configure your developer tools to update the assets on reload: (https://stackoverflow.com/questions/40783790/disable-service-workers-when-in-development-mode).