---
id: button
title: fast-button
sidebar_label: button
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/button/README.md
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#button):

> A button is a widget that enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.

`fast-button` is a web component implementation of an [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). The `fast-components` button supports several visual appearances (accent, lightweight, neutral, outline, stealth).

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastButton
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton()
    );
```

## Usage

```html live
<fast-button appearance="primary">Submit</fast-button>
```

## Create your own design

```ts
import {
    Button,
    buttonTemplate as template,
} from "@microsoft/fast-foundation";
import { buttonStyles as styles } from "./my-button.styles";

export const myButton = Button.compose({
    baseName: "button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the button element rendered into the shadow DOM.
:::

## API

## `src/button/button.ts`:

### class: `Button`

#### Superclass

| Name                   | Module                             | Package |
| ---------------------- | ---------------------------------- | ------- |
| `FormAssociatedButton` | /src/button/button.form-associated |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name                              | Privacy | Type                                         | Default  | Description                                                                                                                                                                                                                               | Inherited From       |
| --------------------------------- | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `autofocus`                       | public  | `boolean`                                    |          | Determines if the element should receive document focus on page load.                                                                                                                                                                     |                      |
| `formId`                          | public  | `string`                                     |          | The id of a form to associate the element to.                                                                                                                                                                                             |                      |
| `formaction`                      | public  | `string`                                     |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \| \<button> element} for more details.                                                                                                                      |                      |
| `formenctype`                     | public  | `string`                                     |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \| \<button> element} for more details.                                                                                                                      |                      |
| `formmethod`                      | public  | `string`                                     |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \| \<button> element} for more details.                                                                                                                      |                      |
| `formnovalidate`                  | public  | `boolean`                                    |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \| \<button> element} for more details.                                                                                                                      |                      |
| `formtarget`                      | public  | `"_self" \| "_blank" \| "_parent" \| "_top"` |          | See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/button \| \<button> element} for more details.                                                                                                                      |                      |
| `type`                            | public  | `"submit" \| "reset" \| "button"`            |          | The button type.                                                                                                                                                                                                                          |                      |
| `defaultSlottedContent`           | public  | `HTMLElement[]`                              |          | Default slotted content                                                                                                                                                                                                                   |                      |
| `handleSubmission`                | private |                                              |          | Submits the parent form                                                                                                                                                                                                                   |                      |
| `handleFormReset`                 | private |                                              |          | Resets the parent form                                                                                                                                                                                                                    |                      |
| `control`                         | public  | `HTMLButtonElement`                          |          |                                                                                                                                                                                                                                           |                      |
| `handleUnsupportedDelegatesFocus` | private |                                              |          | Overrides the focus call for where delegatesFocus is unsupported.&#xD;&#xA;This check works for Chrome, Edge Chromium, FireFox, and Safari&#xD;&#xA;Relevant PR on the Firefox browser: https\://phabricator.services.mozilla.com/D123858 |                      |
| `proxy`                           |         |                                              |          |                                                                                                                                                                                                                                           | FormAssociatedButton |
| `_presentation`                   | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                                                           | FoundationElement    |
| `$presentation`                   | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                                                          | FoundationElement    |
| `template`                        | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.                                              | FoundationElement    |
| `styles`                          | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition.                                     | FoundationElement    |

#### Methods

| Name                    | Privacy   | Description | Parameters                                                                                 | Return | Inherited From    |
| ----------------------- | --------- | ----------- | ------------------------------------------------------------------------------------------ | ------ | ----------------- |
| `formactionChanged`     | private   |             |                                                                                            | `void` |                   |
| `formenctypeChanged`    | private   |             |                                                                                            | `void` |                   |
| `formmethodChanged`     | private   |             |                                                                                            | `void` |                   |
| `formnovalidateChanged` | private   |             |                                                                                            | `void` |                   |
| `formtargetChanged`     | private   |             |                                                                                            | `void` |                   |
| `typeChanged`           | private   |             | `previous: "submit" \| "reset" \| "button" \| void, next: "submit" \| "reset" \| "button"` | `void` |                   |
| `templateChanged`       | protected |             |                                                                                            | `void` | FoundationElement |
| `stylesChanged`         | protected |             |                                                                                            | `void` | FoundationElement |

#### Attributes

| Name          | Field          | Inherited From |
| ------------- | -------------- | -------------- |
|               | autofocus      |                |
| `form`        | formId         |                |
| `formaction`  | formaction     |                |
| `formenctype` | formenctype    |                |
| `formmethod`  | formmethod     |                |
|               | formnovalidate |                |
| `formtarget`  | formtarget     |                |
| `type`        | type           |                |

<hr/>

### class: `DelegatesARIAButton`

#### Fields

| Name           | Privacy | Type                                        | Default | Description                                                                    | Inherited From |
| -------------- | ------- | ------------------------------------------- | ------- | ------------------------------------------------------------------------------ | -------------- |
| `ariaExpanded` | public  | `"true" \| "false" \| undefined`            |         | See {@link https\://www\.w3.org/WAI/PF/aria/roles#button} for more information |                |
| `ariaPressed`  | public  | `"true" \| "false" \| "mixed" \| undefined` |         | See {@link https\://www\.w3.org/WAI/PF/aria/roles#button} for more information |                |

#### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `aria-expanded` | ariaExpanded |                |
| `aria-pressed`  | ariaPressed  |                |

<hr/>

### Exports

| Kind | Name                  | Declaration         | Module               | Package |
| ---- | --------------------- | ------------------- | -------------------- | ------- |
| `js` | `Button`              | Button              | src/button/button.ts |         |
| `js` | `DelegatesARIAButton` | DelegatesARIAButton | src/button/button.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-button)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/button/button.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#button)
* [Open UI Analysis](https://open-ui.org/components/button)