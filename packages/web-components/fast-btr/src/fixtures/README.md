# Fixtures

Each fixture contains the following contents:

```
└── <fixture-name>/
    ├── <fixture-name>.fixture.html - the expected result from the server
    ├── <fixture-name>.html - the decalarative HTML template for the component
    ├── <fixture-name>.json - the JSON data for the component
    ├── <fixture-name>.spec.ts - the test file for the client side TemplateElement
    ├── main.ts - the TypeScript file containing the components definition and the TemplateElement definition
    └── webpack.config.js - the webpack config for this fixture
```

## BTR/SSR

The `.html` and `.json` are intended to be used by a BTR Rust script which will create the `.fixture.html`.

## Client

The `main.ts` is for the client bundle, which is created by the `webpack.config.js`.

**Additional changes outside of this package when creating new fixtures should include:**
- Addition of this webpack config to the packages `package.json` as `build:<fixture-name>`
- Inclusion into the `build-app` script of the new `build:<fixture-name>`
- Addition of the routes for this new fixture in the `./server/server.ts`

## Fixtures

- [x] Binding - a data binding
- [x] Attribute - an attribute binding
- [ ] Boolean Attribute - a boolean attribute binding (`?`)
- [ ] Property - a property binding (`:`)
- [ ] Event - an event binding (`@`)
- [x] When - the when directive
- [ ] Repeat - the repeat directive
- [ ] Ref - the ref directive
- [ ] Slotted - the slotted directive
- [ ] Children - the children directive
- [ ] Template - template references