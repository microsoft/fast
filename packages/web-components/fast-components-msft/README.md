# FAST Components MSFT

## Development

To start the component development environment, run `yarn start`.

### Known issue with Storybook site hot-reloading

Storybook will watch modules for changes and hot-reload the module when necessary. This is usually great but poses a problem when the module being hot-reloaded defines a custom element. A custom element name can only be defined by the `CustomElementsRegistry` once, so reloading a module that defines a custom element will attempt to re-register the custom element name, throwing an error because the name has already been defined. This error will manifest with the following message:
`Failed to execute 'define' on 'CustomElementRegistry': the name "my-custom-element-name" has already been used with this registry`

This is a known issue and will indicate that you need to refresh the page. We're working on surfacing a more instructive error message for this case.
