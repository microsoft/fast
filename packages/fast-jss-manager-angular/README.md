# Angular JSS Manager
An Angular directive and component library for managing component JSS (JavaScript Style Sheets). It allows top-down variable injection into JSS stylesheet functions using the exported `DesignSystem`.

## Installation
`npm i --save @microsoft/fast-jss-manager-angular`

## Usage
Any configuration can be passed down and will serve as a scoped configuration for its containing children. Any component making use of the design system must be constructed with these additions:
- The `@angular/core` `ElementRef` must be passed as a parameter in the components constructor
- The component must pass JSS styles into the `manageJss` higher order component and use that as the styled component
- The component must have an input named `className`

Example component
```ts
import { Component, ElementRef, Inject, Input } from "@angular/core";
import manageJss from "@microsoft/fast-jss-manager-angular";

@Component({
    selector: "example",
    template: `<span [class]="className"><ng-content></ng-content></span>`
})
class ExampleComponent {
    @Input() private className: string;

    constructor(@Inject(ElementRef) private el: ElementRef) { }
}

const styles: any = {
    example: {
        color: (config: any): string => {
            return config.color;
        }
    }
};

const StyledExampleComponent: any = manageJss(styles)(ExampleComponent);

export default StyledExampleComponent;
```

Implementation of the example component in the application
```html
<design-system [config]="{color: 'red'}">
    <example>Hello world</example>
</design-system>
```
