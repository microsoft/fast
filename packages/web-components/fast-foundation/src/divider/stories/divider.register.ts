import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Divider } from "../divider.js";
import { dividerTemplate as template } from "../divider.template.js";

const styles = () => css`
    :host {
        border-left: none;
        border-top: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
        box-sizing: content-box;
        display: block;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
    }
    :host([orientation="vertical"]) {
        border-top: none;
        border-left: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
        height: 100%;
        margin: 0 calc(var(--design-unit) * 1px);
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Divider.compose({
            baseName: "divider",
            styles,
            template,
        })()
    );
