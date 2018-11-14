## Breadcrumb
A generic breadcrumb component following the w3.org [breadcrumb](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/breadcrumb/index.html) pattern. The *breadcrumb* will accept any child elements but is built to work with *breadcrumb item* component.

### Usage
To denote the current page the *breadcrumb* automatically sets the last *breadcrumb item* `href` to "undefined" and `current` prop to "true". Addtionally *breadcrumb* accepts an optional `seperator` prop as a JSX.element that will render a JSX element between navigation elements. To support `rtl` in jss you need to target the `breadcrumb_ol` class for *breadcrumb* and set it to `display: "flex", flexWrap: "wrap"`

### Accessibility
The *breadcrumb* component consists of a `nav` element labeled "Breadcrumb" to identify the structure as a breadcrumb trail and makes it a navigation landmark so that it is easy to locate. The last `a` element is marked "page" to indicate that it reprents the current page.