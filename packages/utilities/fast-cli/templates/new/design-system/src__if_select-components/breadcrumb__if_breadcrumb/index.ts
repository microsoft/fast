import { Breadcrumb, breadcrumbTemplate as template } from "@microsoft/fast-foundation";
import { breadcrumbStyles as styles } from "./breadcrumb.styles";

/**
 * A function that returns a Breadcrumb registration for configuring the component with a DesignSystem.
 * Implements Breadcrumb
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-breadcrumb\>
 */
export const /* @echo namespace */Breadcrumb = Breadcrumb.compose({
    baseName: "breadcrumb",
    template,
    styles,
});

/**
 * Base class for Breadcrumb
 * @public
 */
export { Breadcrumb };
