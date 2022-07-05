import { css } from "@microsoft/fast-element";
import { FASTBreadcrumb } from "../breadcrumb.js";
import { breadcrumbTemplate } from "../breadcrumb.template.js";

const styles = css`
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

FASTBreadcrumb.define({
    name: "fast-breadcrumb",
    template: breadcrumbTemplate(),
    styles,
});
