import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { RadioGroup } from "../radio-group.js";
import { radioGroupTemplate as template } from "../radio-group.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }
    :host {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        margin: calc(var(--design-unit) * 1px) 0;
    }
    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }
    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
    }
    :host([orientation="horizontal"]) .positioning-region {
        flex-direction: row;
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        RadioGroup.compose({
            baseName: "radio-group",
            template,
            styles,
        })()
    );
