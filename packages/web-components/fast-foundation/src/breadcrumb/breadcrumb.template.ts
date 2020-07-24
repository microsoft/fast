import { html } from "@microsoft/fast-element";
import { Breadcrumb } from "./breadcrumb";

/**
 * The template for the {@link @microsoft/fast-foundation#Breadcrumb} component.
 * @public
 */
export const BreadcrumbTemplate = html<Breadcrumb>`
    <template role="navigation" aria-label="breadcrumb">
        <div role="list">
            <slot></slot>
        </div>
    </template>
`;
