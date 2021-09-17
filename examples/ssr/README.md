# Server-Side Rendering FAST Components

## Notes
1. Using NodeJS module resolution, we need to enumerate fast-element (and the other packages) as `"type": "module"`. These currently export ES6 modules so this change is really a fix.
2. Because our packages don't include a ".js" extension when importing assets from files (`import { foo } from "./bar"`) the node process must be run with the  `--es-module-specifier-resolution=node` flag. Otherwise, we need to change imports to point at file locations (`import { foo } from "./bar.js"`)
3. Usage of the Range type in `HTMLView.disposeContiguousBatch()` needs to be removed. I think we can simply call `view.dispose()` for all views provided to the method.
4. `ViewTemplate.create()` uses a HTMLTemplateElement, however the minimal DOM shim does not create a real HTML element, instead returning an object without the required "content.firstElementChild" property required by the ViewTemplate. This prevents us from invoking `Controller.onConnectedCallback()` on the server.
5. We will need a mechanism to retrieve component CSS as a string so that it can be emitted to shadow DOM.