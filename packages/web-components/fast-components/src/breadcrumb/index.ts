import { customElement } from "@microsoft/fast-element";
import { Breadcrumb, BreadcrumbTemplate as template } from "@microsoft/fast-foundation";
import { BreadcrumbStyles as styles } from "./breadcrumb.styles";

/**
 * The FAST Breadcrumb Element. Implements {@link @microsoft/fast-foundation#Breadcrumb},
 * {@link @microsoft/fast-foundation#BreadcrumbTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-breadcrumb\>
 */
@customElement({
    name: "fast-breadcrumb",
    template,
    styles,
})
export class FASTBreadcrumb extends Breadcrumb {}
