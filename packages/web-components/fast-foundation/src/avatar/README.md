---
id: avatar
title: fast-avatar
sidebar_label: avatar
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/avatar/README.md
---

The  `fast-avatar` component is used to graphically represent a user or an object.

## Usage

The `fill` and `color` attributes of the *avatar* create CSS custom properties which can be used to style the control.

__Example custom property map__
```css
fast-avatar {
    --avatar-fill-primary: #00FF00;
    --avatar-fill-danger: #FF0000;
    --avatar-color-light: #FFFFFF;
    --avatar-color-dark: #000000;
}
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Avatar, AvatarTemplate as template } from "@microsoft/fast-foundation";
import { AvatarStyles as styles } from "./avatar.styles";

@customElement({
  name: "fast-avatar",
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true
  }
})
export class FASTAvatar extends Avatar {}
```