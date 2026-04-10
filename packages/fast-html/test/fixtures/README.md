# Fixtures

Each fixture contains the following contents:

```
<fixture-name>/
├── <fixture-name>.spec.ts - Playwright tests
├── entry.html - Entry template with root custom elements (input to build-fixtures.js)
├── index.html - Pre-rendered HTML page served by Vite (generated from entry.html + state.json + templates.html)
├── main.ts - Component definition and setup
├── state.json - Initial state passed to the server-side renderer
└── templates.html - Declarative f-template definitions
```

Fixtures are auto-discovered by the Vite config in `../vite.config.ts`. To add a new fixture, create a new directory with the files above — no other changes are needed.

## Entry HTML attribute guidelines

The `entry.html` file defines the root custom elements that the server-side renderer processes. When writing attribute bindings on root elements, follow these conventions:

- **Same-name complex bindings are unnecessary.** Attributes like `list="{{list}}"` where `list` is an array or object are redundant — non-primitive values are automatically stripped from the rendered opening tag, and state propagation already provides the value to the element's template. Omit these attributes.
- **Rename bindings should be avoided.** Prefer naming state properties to match the attribute name the element expects. When a rename such as `foo="{{bar}}"` is removed, ensure `state.json` includes a property named `foo` with the contents of `bar` so the value is available via state propagation.
- **Property bindings (`:attr`) for renames are acceptable** when multiple instances of the same element in a fixture need different values for the same property (e.g., `:items="{{emptyItems}}"` and `:items="{{singleItem}}"` on separate elements).
- **Primitive same-name bindings are fine.** Attributes like `type="{{type}}"` where the value is a string, number, or boolean are rendered onto the opening tag and may be needed for `@attr`-based element initialization.
