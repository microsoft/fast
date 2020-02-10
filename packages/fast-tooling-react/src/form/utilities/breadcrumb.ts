import { BreadcrumbItemEventHandler } from "../form.props";
import { TreeNavigation } from "../../message-system/navigation.props";
import { DataType } from "../../data-utilities/types";

export interface BreadcrumbItem {
    href: string;
    text: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type HandleBreadcrumbClick = (navigationId: string) => BreadcrumbItemEventHandler;

/**
 * Gets breadcrumbs from navigation items
 */
export function getBreadcrumbs(
    navigation: TreeNavigation,
    navigationId: string,
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[] {
    let navigationItems: BreadcrumbItem[] = [];

    // Arrays do not need to be represented in breadcrumbs
    // as the array items are shown at the same level as
    // other simple controls
    if (navigation[navigationId].type !== DataType.array) {
        navigationItems.push({
            href: navigation[navigationId].self,
            text: navigation[navigationId].text,
            onClick: handleClick(navigationId),
        });
    }

    if (navigation[navigation[navigationId].parent]) {
        navigationItems = navigationItems.concat(
            getBreadcrumbs(navigation, navigation[navigationId].parent, handleClick)
        );
    }

    return navigationItems.reverse();
}
