import { css } from "@microsoft/fast-element";
import { FASTRadioGroup } from "../radio-group.js";
import { radioGroupTemplate } from "../radio-group.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        margin: calc(var(--design-unit) * 1px) 0;
    }

    .control {
        display: flex;
        flex-wrap: wrap;
    }

    :host([orientation="vertical"]) .control {
        flex-direction: column;
    }

    :host([orientation="horizontal"]) .control {
        flex-direction: row;
    }
`;

FASTRadioGroup.define({
    name: "fast-radio-group",
    template: radioGroupTemplate(),
    styles,
});
