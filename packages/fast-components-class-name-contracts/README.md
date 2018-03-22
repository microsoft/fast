# fast-components-class-name-contracts
This package provides the TypeScript typings for all FAST components class-name contracts. These contracts enable strict typing of JSS stylesheets and each component's expectation of which class-names will be made available (and under which keys those class-names reside) to the component at runtime.

## A deeper dive
FAST base components are built from the ground-up to work with CSS module implementations. This means that each HTML `class` attribute can be dynamic and unique. To facilitate working with any CSS module implementation, each component expects as a data the `class` attribute values when the component is instantiated.

These contracts simply describe - as TypeScript interfaces - the key/value pairs that each component can expect to be able to use when retrieving these dynamic class-names.

```tsx
inteface IButtonClassNameContract {
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

## TypeScript only
This package only contains TypeScript interfaces to be used by other packages - as such, it will get completely compiled out of your project during your build to JavaScript. If you're not using TypeScript, this package will have no effect on your codebase.