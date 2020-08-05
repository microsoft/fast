import { customElement } from "@microsoft/fast-element";
import {
    BreadcrumbItem,
    BreadcrumbItemTemplate as template,
} from "@microsoft/fast-foundation";
import { BreadcrumbItemStyles as styles } from "./breadcrumb-item.styles";

/**
 * The FAST BreadcrumbItem Element. Implements {@link @microsoft/fast-foundation#BreadcrumbItem},
 * {@link @microsoft/fast-foundation#BreadcrumbItemTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-breadcrumb-item\>
 */
@customElement({
    name: "fast-breadcrumb-item",
    template,
    styles,
})
export class FASTBreadcrumbItem extends BreadcrumbItem {}
