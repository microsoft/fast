# FAST Components foundation React

The foundation component for FAST component packages in React. The default export is an extension from the `React.Component` and includes additional functionality for extension by React component libraries. There is also a named export for `PureFoundation` which is an extension from `React.PureComponent`.

## Installation

`npm i --save @microsoft/fast-components-foundation-react`

## Usage

### Basic implementation

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation from "@microsoft/fast-components-foundation-react";

class MyComponent extends Foundation {
    render() {
        return <div />;
    }
}

export default MyComponent;
```

### Unhandled props

A method which allows any property that has not been specified by the component extending `Foundation` to be accessed, eg. `onClick`, `aria` and datasets.

Component example:

```jsx
class MyComponent extends Foundation {
    render() {
        return <div {...this.unhandledProps()} />;
    }
}
```

Component implementation:

```jsx
<MyComponent id={"my-component"} aria-hidden={true} />
```

Rendered result:

```html
<div id="my-component" aria-hidden="true"></div>
```

### `setRef` and `getRef`

The `setRef` and `getRef` use lodash's get/set API, so the provided `string` can be `my-component-element`, `my-component-element[0]` etc.

```jsx
class MyComponent extends Foundation {
    componentDidMount() {
        const myComponentElement = this.getRef("my-component-element");

        // do something
    }

    render() {
        return <div ref={this.setRef("my-component-element")} />;
    }
}
```

### `generateClassNames`

This method can be used to pass any className when it is passed.

Component example:

```jsx
class MyComponent extends Foundation {
    render() {
        return <div className={this.generateClassNames()} />;
    }
}
```

Component implementation:

```jsx
<MyComponent className={"my-class-name"} />
```

Rendered result:

```html
<div class="my-class-name"></div>
```

### `withSlot` (Foundation only)

Gets all children with the `slot` prop that matches a given string, example: `this.withSlot("after")`. 

Component example:

```jsx
class MyComponent extends Foundation {
    render() {
        return (
            <div>
                {this.withSlot("foo")}
            </div>
        );
    }
}
```

Component implementation:

```jsx
<MyComponent>
    <span slot="foo">
        Hello, world!
    </span>
</MyComponent>
```

Rendered result:

```html
<div>
    <span>
        Hello, world!
    </span>
</div>
```

### `withoutSlot` (Foundation only)

Gets all children with the `slot` prop that does not match a given string, example: `this.withoutSlot("after")`.

Component example:

```jsx
class MyComponent extends Foundation {
    render() {
        return (
            <div>
                {this.withoutSlot("foo")}
            </div>
        );
    }
}
```

Component implementation:

```jsx
<MyComponent>
    <span slot="foo">
        Hello, world!
    </span>
    <h1 slot="bar">
        Hello, pluto!
    </h1>
    <h2 slot="bat">
        A bold new world
    </h2>
</MyComponent>
```

Rendered result:

```html
<div>
    <h1>
        Hello, pluto!
    </h1>
    <h2>
        A bold new world
    </h2>
</div>
```