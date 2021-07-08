import { Breadcrumb, breadcrumbTemplate as template } from "@microsoft/fast-foundation";
import { breadcrumbStyles as styles } from "./breadcrumb.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Breadcrumb} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#breadcrumbTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-breadcrumb\>
 */
export const fastBreadcrumb = Breadcrumb.compose({
    baseName: "breadcrumb",
    template,
    styles,
});

/**
 * Base class for Breadcrumb
 * @public
 */
export { Breadcrumb };
