import { css, customElement, FastElement, html } from "@microsoft/fast-element";

const template = html`
    <button><slot></slot></button>
`;

const styles = css`
    :host {
        display: inline-block;
    }
    button {
        box-sizing: border-box;
        padding: 0 8px;
        min-width: 30px;
        height: 30px;
        border: none;
        background: var(--neutral-fill-stealth-rest);
        outline: none;
    }

    button:focus {
        border-color: var(--neutral-outline-rest);
    }
    button:hover {
        background: var(--neutral-fill-stealth-hover);
    }

    button:active {
        background: var(--neutral-fill-stealth-active);
    }
`;

@customElement({
    name: "stealth-button",
    template,
    styles,
    shadowOptions: {
        mode: "open",
        delegatesFocus: true,
    },
})
export class StealthButton extends FastElement {}
