import { html, ref } from "@microsoft/fast-element";
import { Menu } from "./menu";

export const MenuTemplate = html<Menu>`
<template
    role="menu"
    @keydown=${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}
    @focusout=${(x, c) => x.handleFocusOut(c.event as FocusEvent)}
    >
    <slot
        ${ref("items")}
    ></slot>
</template>
`;
