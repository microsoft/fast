
# FAST browser extension (Beta)
An extension for testing real-world localization, theming, and other production type scenarios in web development.

Originally devised for Fluent on Web as a way to visualize prototypes in many different user scenarios. For example, view a website in one of the 194 different localized settings.

Initially, focused on Chrome, with a follow up for Edge.

## Set up development environment
### Chrome
1. Obtain a chrome.pem key and place it in a convenient, yet, secure location.
2. Open run `npm run dev:chrome`
3. Navigate to [chrome://extensions](chrome://extensions) in Chrome Browser
4. Click 'Load unpacked extension...' and select `dist/chrome` (relative to project root)
5. Click 'Pack extension...' where:
    - Extension Root Directory is `dist/chrome` (relative to project root)
    - Private key file is the chrome.pem file you obtained.

## Additional resources
[Controlling the extension ID](https://stackoverflow.com/questions/21497781/how-to-change-chrome-packaged-app-id-or-why-do-we-need-key-field-in-the-manifest/21500707#21500707)
[Keep development ID consistent](https://developer.chrome.com/apps/app_identity#copy_key)

## Ownership
Contact Fluent Web Questions <fwq@microsoft.com> for details on this repository.