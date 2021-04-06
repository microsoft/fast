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
export const FASTBreadcrumb = Breadcrumb.compose({
    baseName: "breadcrumb",
    template,
    styles,
});
