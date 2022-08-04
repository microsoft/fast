---
id: avatar
title: fast-avatar
sidebar_label: avatar
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/avatar/README.md
description: fast-avatar is a web component used to graphically represent a user or an object.
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



### class: `FASTAvatar`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name   | Privacy | Type     | Default | Description                               | Inherited From |
| ------ | ------- | -------- | ------- | ----------------------------------------- | -------------- |
| `link` | public  | `string` |         | Indicates the Avatar should have url link |                |

#### Attributes

| Name   | Field | Inherited From |
| ------ | ----- | -------------- |
| `link` | link  |                |

#### CSS Parts

| Name        | Description                           |
| ----------- | ------------------------------------- |
| `backplate` | The wrapping container for the avatar |
| `link`      | The avatar link                       |
| `content`   | The default slot                      |

#### Slots

| Name    | Description                                                   |
| ------- | ------------------------------------------------------------- |
| `media` | Used for media such as an image                               |
|         | The default slot for avatar text, commonly a name or initials |
| `badge` | Used to provide a badge, such as a status badge               |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-avatar)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/avatar/avatar.spec.md)
* [Open UI Analysis](https://open-ui.org/components/avatar.research)