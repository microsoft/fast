# Creator specifications

This file contains all specifications in regards to the Creator app's architecture and planning. Additional information may be referred to from supplemental markdown files.

- [Projects](#projects)
    - [Web component libraries](#web-component-libraries)

## Projects

Projects are the serializable data that users create and modify in the FAST Creator app. They consist of multi-page layouts representing sites.

### Web component libraries

A project can include web component libraries such as FAST components, these are opt-in.

#### Adding a library

Libraries are available in the component tab in the left pane, they can be enabled and this will give the user autocompletion in the `<Form />` linked data field as well as providing a list of components that can be drag and dropped onto the preview area. Adding a library will allow the components in the library to be rendered in the preview.

Each library will be defined by a configuration which includes the web components themselves, data examples that will be used when a component is added, the tag name of the components and the display name. See the [typings](./app/configs/typings.ts) file for the interface.

When a user adds a library to a project, this library configuration will be dynamically imported.
