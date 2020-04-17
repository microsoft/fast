import {
    NavigationConfigDictionary,
    Parent,
    TreeNavigation,
} from "@microsoft/fast-tooling";
import { DataType } from "@microsoft/fast-tooling";
import { BreadcrumbItemEventHandler } from "../form.props";

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

    return navigationItems;
}

/**
 * Resolve breadcrumbs from navigation dictionary
 */
export function resolveDictionaryBreadcrumbs(
    navigationDictionary: NavigationConfigDictionary,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick,
    breadcrumbItemList: BreadcrumbItem[][] = []
): BreadcrumbItem[] {
    const breadcrumbItems: BreadcrumbItem[][] = breadcrumbItemList.concat([
        getBreadcrumbs(
            navigationDictionary[0][dictionaryId][0],
            dictionaryId,
            navigationConfigId,
            handleClick
        ),
    ]);

    const breadcrumbParent: Parent | undefined =
        navigationDictionary[0][dictionaryId][0][navigationDictionary[0][dictionaryId][1]]
            .parentDictionaryItem;

    if (typeof breadcrumbParent !== "undefined") {
        return resolveDictionaryBreadcrumbs(
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
 * Get breadcrumbs from navigation dictionary
 */
export function getDictionaryBreadcrumbs(
    navigationDictionary: NavigationConfigDictionary,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[] {
    return resolveDictionaryBreadcrumbs(
        navigationDictionary,
        dictionaryId,
        navigationConfigId,
        handleClick
    ).reverse();
}
