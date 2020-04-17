import manageJss from "@microsoft/fast-jss-manager-react";
import BaseNavigationMenu from "./navigation-menu";
import NavigationMenuStyles from "./navigation-menu.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const NavigationMenu = manageJss(NavigationMenuStyles)(BaseNavigationMenu);
type NavigationMenu = InstanceType<typeof NavigationMenu>;

export { NavigationMenu };
export * from "./navigation-menu.props";
export * from "./navigation-menu-item.props";
