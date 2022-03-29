---
id: avatar
title: fast-avatar
sidebar_label: avatar
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/avatar/README.md
---

The `fast-avatar` component is used to graphically represent a user or an object.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastAnchoredRegion
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastAvatar()
    );
```

### Custom Media

```ts
import { Avatar } from "@microsoft/fast-foundation";
import {
    provideFASTDesignSystem,
    fastAnchoredRegion
} from "@microsoft/fast-components";

const imgTemplate = html<Avatar>`
    ...your own template that controls rendering images...
`;

provideFASTDesignSystem()
    .register(
        fastAvatar({
          media: imgTemplate
        })
    );
```

## Usage

### Basic Usage

```html
<fast-avatar 
  src="..."
  alt="..."
  link="...">
</fast-avatar>
```

### Used with a Badge

```html
<fast-avatar
  src="..." 
  alt="..."
  link="...">
  <fast-badge slot="badge">&nbsp</fast-badge>
</fast-avatar>
```

### Filled, Colored, and Shaped

The `fill` and `color` attributes of the *avatar* create CSS custom properties which can be used to style the control.

```css
fast-avatar {
    --avatar-fill-primary: #00FF00;
    --avatar-fill-danger: #FF0000;
    --avatar-color-light: #FFFFFF;
    --avatar-color-dark: #000000;
}
```

While the `shape` attribute lets you choose between `circle` (default) or `square`:

```html
<fast-avatar 
  src="..."
  alt="..."
  link="..."
  fill="primary"
  color="dark"
  shape="square">
</fast-avatar>
```

## Create your own design

```ts
import {
    AvatarOptions,
    Avatar,
    avatarTemplate as template,
} from "@microsoft/fast-foundation";
import { avatarStyles as styles } from "./my-avatar.styles";

export const myAvatar = Avatar.compose<AvatarOptions>({
    baseName: "avatar",
    template,
    styles,
    media: imgTemplate,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the anchor element rendered into the shadow DOM.
:::

## API

### `src/avatar/avatar.template.ts`:

#### Functions

| Name             | Description                                                           | Parameters            | Return |
| ---------------- | --------------------------------------------------------------------- | --------------------- | ------ |
| `avatarTemplate` | The template for {@link @microsoft/fast-foundation#Avatar} component. | `context, definition` |        |

<hr/>

#### Exports

| Kind | Name             | Declaration    | Module                        | Package |
| ---- | ---------------- | -------------- | ----------------------------- | ------- |
| `js` | `avatarTemplate` | avatarTemplate | src/avatar/avatar.template.ts |         |

### `src/avatar/avatar.ts`:

#### class: `Avatar`

##### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

##### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

##### Fields

| Name            | Privacy | Type                                         | Default  | Description                                                                                                                                                                                           | Inherited From    |
| --------------- | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `fill`          | public  | `string`                                     |          | Indicates the Avatar should have a color fill.                                                                                                                                                        |                   |
| `color`         | public  | `string`                                     |          | Indicates the Avatar should have a text color.                                                                                                                                                        |                   |
| `link`          | public  | `string`                                     |          | Indicates the Avatar should have url link                                                                                                                                                             |                   |
| `shape`         | public  | `AvatarShape`                                |          | Indicates the Avatar shape should be. By default it will be set to "circle".                                                                                                                          |                   |
| `_presentation` | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                       | FoundationElement |
| `$presentation` | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                      | FoundationElement |
| `template`      | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.          | FoundationElement |
| `styles`        | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition. | FoundationElement |

##### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

##### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `fill`  | fill  |                |
| `color` | color |                |
| `link`  | link  |                |
| `shape` | shape |                |

<hr/>

#### Exports

| Kind | Name     | Declaration | Module               | Package |
| ---- | -------- | ----------- | -------------------- | ------- |
| `js` | `Avatar` | Avatar      | src/avatar/avatar.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-avatar)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/avatar/avatar.spec.md)
* [Open UI Analysis](https://open-ui.org/components/avatar.research)