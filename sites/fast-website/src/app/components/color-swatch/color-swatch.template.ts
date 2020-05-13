import { html, when } from "@microsoft/fast-element";
import { ColorSwatch } from "./color-swatch";

export const ColorSwatchTemplate = html<ColorSwatch>`
<template
    role="radio"
    class="${x => (x.checked ? "checked" : "")} ${x =>
        x.readOnly ? "readonly" : ""}"
    aria-checked="${x => x.checked}"
    aria-required="${x => x.required}"
    aria-disabled="${x => x.disabled}"
    aria-readonly="${x => x.readOnly}"
    @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
    @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
    <div part="control" class="control" style="background: ${x => x.backgroundColor}">
        <slot name="checked-indicator">
            <div part="checked-indicator" class="checked-indicator"></div>
        </slot>
    </div>
    ${when(
        x => x.childNodes.length,
        html`
            <label part="label" class="label">
                <slot></slot>
            </label>
        `
    )}
</template>
`;
