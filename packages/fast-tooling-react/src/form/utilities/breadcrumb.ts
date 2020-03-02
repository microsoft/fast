import { BreadcrumbItemEventHandler } from "../form.props";
import {
    TreeNavigation,
    TreeNavigationConfigDictionary,
} from "../../message-system/navigation.props";
import { DataType } from "../../data-utilities/types";
import { Parent } from "../../message-system/data.props";

export interface BreadcrumbItem {
    href: string;
    text: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type HandleBreadcrumbClick = (
    dictionaryId: string,
    navigationConfigId: string
) => BreadcrumbItemEventHandler;

/**
 * Get breadcrumbs from navigation dictionary
 */
export function getDictionaryBreadcrumbs(
    navigationDictionary: TreeNavigationConfigDictionary,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick,
    breadcrumbItemList: BreadcrumbItem[][] = []
): BreadcrumbItem[] {
    const breadcrumbItems: BreadcrumbItem[][] = [
        getBreadcrumbs(
            navigationDictionary[0][dictionaryId][0],
            dictionaryId,
            navigationConfigId,
            handleClick
        ),
    ].concat(breadcrumbItemList);

    const breadcrumbParent: Parent | undefined =
        navigationDictionary[0][dictionaryId][0][navigationDictionary[0][dictionaryId][1]]
            .parentDictionaryItem;

    if (typeof breadcrumbParent !== "undefined") {
        return getDictionaryBreadcrumbs(
            navigationDictionary,
            breadcrumbParent.id,
            breadcrumbParent.dataLocation, // unsafe replace with a search to find the dictionary id of this
            handleClick,
            breadcrumbItems
        );
    }

    return breadcrumbItems.reduce(
        (accum: BreadcrumbItem[], breadcrumbItem: BreadcrumbItem[]): BreadcrumbItem[] => {
            return accum.concat(breadcrumbItem);
        },
        []
    );
}

/**
 * Gets breadcrumbs from navigation items
 */
export function getBreadcrumbs(
    navigation: TreeNavigation,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[] {
    let navigationItems: BreadcrumbItem[] = [];

    // Arrays do not need to be represented in breadcrumbs
    // as the array items are shown at the same level as
    // other simple controls
    if (navigation[navigationConfigId].type !== DataType.array) {
        navigationItems.push({
            href: navigation[navigationConfigId].self,
            text: navigation[navigationConfigId].text,
            onClick: handleClick(dictionaryId, navigationConfigId),
        });
    }

    if (navigation[navigation[navigationConfigId].parent]) {
        navigationItems = navigationItems.concat(
            getBreadcrumbs(
                navigation,
                dictionaryId,
                navigation[navigationConfigId].parent,
                handleClick
            )
        );
    }

    return navigationItems.reverse();
}
