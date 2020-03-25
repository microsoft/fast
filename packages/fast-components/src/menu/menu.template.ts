import { html, ref } from "@microsoft/fast-element";
import { Menu } from "./menu";

export const MenuTemplate = html<Menu>`
<template
    role="menu"
    @keydown=${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}
>
    <slot
        ${ref("items")}
    ></slot>
</template
`;
