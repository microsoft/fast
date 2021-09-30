# Server-Side Rendering FAST Components

## Test cases
[x] Custom element rendered in light DOM
[x] Custom element rendered into shadow DOM
[] Custom element rendered into light DOM slot
[] Custom element rendered into shadow DOM slot
[x] Conditional template rendering
[] Repeat template rendering
[] Attribute value binding
[] Boolean attribute binding
[] Property value binding
[] Component stylesheet emission
[] Design token custom property emission
[] Observable changes affecting template in connectedCallback
[] Open and closed shadow roots

## Notes
1. Using NodeJS module resolution, we need to enumerate fast-element (and the other packages) as `"type": "module"`. These currently export ES6 modules so this change is really a fix.
2. Because our packages don't include a ".js" extension when importing assets from files (`import { foo } from "./bar"`) the node process must be run with the  `--es-module-specifier-resolution=node` flag. Otherwise, we need to change imports to point at file locations (`import { foo } from "./bar.js"`)
3. Usage of the Range type in `HTMLView.disposeContiguousBatch()` needs to be removed. I think we can simply call `view.dispose()` for all views provided to the method.
4. `ViewTemplate.create()` uses a HTMLTemplateElement, however the minimal DOM shim does not create a real HTML element, instead returning an object without the required "content.firstElementChild" property required by the ViewTemplate. This prevents us from invoking `Controller.onConnectedCallback()` on the server.
5. We will need a mechanism to retrieve component CSS as a string so that it can be emitted to shadow DOM.
6. happy-dom does not support `Node.hasChildNodes()` which is leveraged by `HTMLView.insertBefore()`, so that method must be changed to test child length.
7. Lit's "render" method doesn't know how to process raw strings into declarative shadow-dom custom elements, so this preculdes us from simply calling `yield* render(innerHTML, context)` in the `renderShadow()` method.
8. Lit-ssr's render() does not understand DOM that is interpolated into the html tagged-template literal, so this demo contains a work-around that may be un-safe.