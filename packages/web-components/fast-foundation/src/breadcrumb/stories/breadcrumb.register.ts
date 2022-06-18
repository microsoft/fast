import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Breadcrumb } from "../breadcrumb.js";
import { breadcrumbTemplate as template } from "../breadcrumb.template.js";

const styles = () => css`
    :host {
        box-sizing: border-box;
        display: inline-block;
        font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
            var(--body-font);
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Breadcrumb.compose({
            baseName: "badge",
            styles,
            template,
        })()
    );
