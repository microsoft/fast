import { attr, css, FASTElement, html } from "@microsoft/fast-element";
export class TestWidget extends FASTElement {
    @attr
    label?: string;

    @attr({ mode: "boolean" })
    disabled: boolean = false;

    disabledChanged(prev: boolean, next: boolean) {
        if (this.disabled) {
            this.#internals?.states.add("disabled");
        } else {
            this.#internals?.states.delete("disabled");
        }
    }

    @attr
    size?: string;

    #internals: ElementInternals = this.attachInternals();
}

export const definition = {
    name: "test-widget",
    template: html<TestWidget>`
        <span class="label">${x => x.label}</span>
        <slot></slot>
    `,
    styles: css`
        :host {
            display: inline-block;
        }
        .label {
            font-weight: bold;
        }
    `,
};

TestWidget.define(definition);
