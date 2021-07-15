import {
    BreadcrumbItem,
    BreadcrumbItemOptions,
    breadcrumbItemTemplate as template,
} from "@microsoft/fast-foundation";
import { breadcrumbItemStyles as styles } from "./breadcrumb-item.styles";

/**
 * A function that returns a Breadcrumb Item registration for configuring the component with a DesignSystem.
 * Implements Breadcrumb Item
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-breadcrumb-item\>
 */
export const /* @echo namespace */BreadcrumbItem = BreadcrumbItem.compose<BreadcrumbItemOptions>({
    baseName: "breadcrumb-item",
    template,
    styles,
    separator: "/",
    shadowOptions: {
        delegatesFocus: true,
    },
});

/**
 * Base class for BreadcrumbItem
 * @public
 */
export { BreadcrumbItem };
