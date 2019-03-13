---
id: index
---


FAST Components class name contracts base
=========================================

This package provides the TypeScript typings for all FAST components class-name contracts. These contracts enable strict typing of JSS stylesheets and each component's expectation of which class-names will be made available (and under which keys those class-names reside) to the component at runtime.

A deeper dive
-------------

FAST base components are built from the ground-up to work with CSS module implementations. This means that each HTML `class` attribute can be dynamic and unique. To facilitate working with any CSS module implementation, each component expects as a data the `class` attribute values when the component is instantiated.

These contracts simply describe - as TypeScript interfaces - the key/value pairs that each component can expect to be able to use when retrieving these dynamic class-names.

```tsx
inteface ButtonClassNameContract {
    button: string;
}

// In the button base-component, we use the class-name contract to inform which keys will available on the
// `managedClasses` object, which is where dynamic class-names get added as props to a component.
render(): JSX.Element {
    return (
        <button className={this.props.managedClasses.button}>{this.props.children}</button>
    );
}
```

TypeScript only
---------------

This package only contains TypeScript interfaces to be used by other packages - as such, it will get completely compiled out of your project during your build to JavaScript. If you're not using TypeScript, this package will have no effect on your codebase.

## Index

### External modules

* ["badge/index"](modules/_badge_index_.md)
* ["breadcrumb/index"](modules/_breadcrumb_index_.md)
* ["button/index"](modules/_button_index_.md)
* ["card/index"](modules/_card_index_.md)
* ["checkbox/index"](modules/_checkbox_index_.md)
* ["context-menu-item/index"](modules/_context_menu_item_index_.md)
* ["context-menu/index"](modules/_context_menu_index_.md)
* ["dialog/index"](modules/_dialog_index_.md)
* ["divider/index"](modules/_divider_index_.md)
* ["horizontal-overflow/index"](modules/_horizontal_overflow_index_.md)
* ["hypertext/index"](modules/_hypertext_index_.md)
* ["image/index"](modules/_image_index_.md)
* ["index"](modules/_index_.md)
* ["label/index"](modules/_label_index_.md)
* ["listbox-item/index"](modules/_listbox_item_index_.md)
* ["listbox/index"](modules/_listbox_index_.md)
* ["managed-classes"](modules/_managed_classes_.md)
* ["number-field/index"](modules/_number_field_index_.md)
* ["progress/index"](modules/_progress_index_.md)
* ["radio/index"](modules/_radio_index_.md)
* ["select/index"](modules/_select_index_.md)
* ["tabs/index"](modules/_tabs_index_.md)
* ["text-area/index"](modules/_text_area_index_.md)
* ["text-field/index"](modules/_text_field_index_.md)
* ["toggle/index"](modules/_toggle_index_.md)
* ["typography/index"](modules/_typography_index_.md)

---

