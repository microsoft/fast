# Form
This is the form component that takes a JSON schema and generates a UI to edit the data. This can be combined with React components to make editable components.

## Components
### `Form`
The `Form` is the root component.
It controls:
- The schema and data passed to the `FormSection`
- The title and breadcrumbs which are updated based on the `activeSchemaLocation`
- A list of components to keep track of for navigation

#### Props
- **schema** (*The schema to be used at the root*)
- **data** (*The data to map to the form*)
- **onChange** (*The onChange callback to fire when the data is changed*)
- **childOptions** (*The options to allow as children*)
- **config** (*The layout configuration*)

#### State:
- **schema** (*The current subset of the schema*)
- **activeSchemaLocation** (*The current schema location -- using lodash location syntax*)
- **activeDataLocation** (*The current data location -- using lodash location syntax*)
- **dataCache** (*The dataCache which will store data and use it to match to the component when switching between subschemas*)
- **titleProps** (*Heading props used for the title of the subsection*)
- **componentTracker** (*Tracks the components to allow children*)

#### Navigation
##### `onUpdateActiveSection`
The `onUpdateActiveSection` is a callback that takes the `schemaLocation`, `dataLocation` and `schema`. It will update the `componentTracker`, `activeSchemaLocation` and `activeDataLocation`.

##### `componentTracker`
The `componentTracker` keeps track of the `dataLocation`, `schemaLocation` and `schema`. If a user moves into a child element, this adds a new component to be tracked by the component tracker. If the user moves 'up' the tree (via breadcrumbs) all sub items from the section selected will be removed from the `componentTracker`.

### `FormSection`
The `FormSection` is a sub-component of Form. It generates a form element in which the schema given to it will generate form items.

#### Props:
- **schema** (*The subschema provided by the `Form`*)
- **data** (*The subdata provided by the `Form`*)
- **dataLocation** (*The location of the data -- used for onChange, this is always absolute to the root schema passed in `Form`*)
- **schemaLocation** (*The location of the schema -- this is always relative to the current schema*)
- **dataCache** (*The cached data passed by the `Form`*)
- **onChange** (*The onChange callback to fire when the data is changed*)
- **childOptions** (*The options to allow as `children`*)
- **onUpdateActiveSection** (*The callback to update the active section*)
- **untitled** (*The string to use if a section/item/etc lacks text or title*)

#### Navigation - Section links
If the section being viewed has subsections, the links of these will be generated, when clicked they will use the `onUpdateActiveSection` callback to the `Form` to trigger a different section to display, this should get added onto the current active section since we always move one level deeper.

##### Toggling new section links
If the section is an object and the section has optional properties that are also objects, these will generate a toggle to add/remove them.

### `FormItem.Children`
This element displays a dropdown for removing `children`, a list of current `children` and a list of possible `children` that can be added.

### `FormItem.Array`
This element displays a dropdown for removing items and a list of current items.

#### Navigation - Array item links
If an array item exists, it will generate a link, click it will call the `onUpdateActiveSection` callback to the `Form` to trigger the subsection of the array to display.

### `FormItem.Checkbox`
This element is generated from a type `boolean`.

### `FormItem.Select`
This element is generated from an `enum` of any type.

### `FormItem.TextField`
This element is generated from type `string` or `number`.

## Configuring the Schema Form
The schema form takes a configuration object with properties that will map to layout controls.

Example:
```
var config = {
    customColor: ['color'],
    alignVertical: ['align']
};
```

See the README for the schema-form-layout component for more details.

## Schema Form component mappings to property names
This is the form layout component that maps different form layouts for the schema form to use.

### Custom color
Maps a string value to allow a custom color to be chosen by showing a color picker.

Example:
```
customColor: ['color', 'backgroundColor']
```

### Swatch
Maps a string value to allow a set number of strings that correspond to CSS values by showing swatches.

Example:
```
swatch: ['color']
```

### Align Horizontal
Maps a string value to allow all or a subset of the strings 'left', 'center', 'right' using buttons with glyphs.

Example:
```
alignHorizontal: ['align']
```

### Align Vertical
Maps a string value to allow all or a subset of the strings 'top', 'center', 'bottom' using buttons with glyphs.

Example:
```
alignVertical: ['align']
```

### Theme
Maps a string value to allow all or a subset of the strings 'light', 'dark' using buttons with glyphs.

Example:
```
theme: ['theme']
```

### File upload
Maps a string value to allow a file to be uploaded to a location using an onChange event.

Example:
```
fileUpload: {
    propertyNames: ['align'],
    onChange: function() {
        // do something
    }
}
```