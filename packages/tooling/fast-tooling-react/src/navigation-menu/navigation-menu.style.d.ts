import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { NavigationMenuItemClassNameContract } from "./navigation-menu-item.props";
export interface NavigationMenuClassNameContract
    extends NavigationMenuItemClassNameContract {
    navigationMenu?: string;
}
declare const styles: ComponentStyles<NavigationMenuClassNameContract, {}>;
export default styles;
