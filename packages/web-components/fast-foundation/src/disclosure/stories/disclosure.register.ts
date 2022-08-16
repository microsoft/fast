import { css } from "@microsoft/fast-element";
import { FASTDisclosure } from "../disclosure.js";
import { disclosureTemplate } from "../disclosure.template.js";

const styles = css`
    .details {
        transition: height 0.35s;
    }
    .summary::-webkit-details-marker {
        display: none;
    }
    .summary {
        list-style-type: none;
        background: var(--accent-fill-rest);
        color: var(--foreground-accent-rest);
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        border-radius: calc(var(--control-corner-radius) * 1px);
        outline: none;
        cursor: pointer;
        margin: 16px 0;
        padding: 12px;
        max-width: max-content;
    }
    .summary:focus-visible,
    .summary:active {
        background: var(--accent-fill-active);
        color: var(--foreground-accent-active);
    }
    .summary:hover {
        background: var(--accent-fill-hover);
        color: var(--foreground-on-accent-hover);
    }
    .summary {
        background: transparent;
        color: var(--accent-foreground-rest);
        cursor: pointer;
        width: max-content;
        margin: 16px 0;
    }

    .details[open] .summary ~ * {
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;

FASTDisclosure.define({
    name: "fast-disclosure",
    shadowOptions: {
        delegatesFocus: true,
    },
    styles,
    template: disclosureTemplate(),
});
