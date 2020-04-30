import {
    dictionaryLink,
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
    activeNavigationConfigId: string,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[] {
    let navigationItems: BreadcrumbItem[] = [];

    /**
     * Items that do not need to be represented in breadcrumbs
     * because they are shown at the same level as simple controls
     * unless it is the root dictionary ID:
     * - Arrays
     * - The parent item of another dictionary link
     */
    if (
        navigationConfigId === activeNavigationConfigId ||
        (navigation[navigationConfigId].type !== DataType.array &&
            !(
                navigation[navigationConfigId].parent &&
                navigation[navigation[navigationConfigId].parent].schema[dictionaryLink]
            ))
    ) {
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
                activeNavigationConfigId,
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
    activeNavigationConfigId: string,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick,
    breadcrumbItemList: BreadcrumbItem[][] = []
): BreadcrumbItem[] {
    const breadcrumbItems: BreadcrumbItem[][] = breadcrumbItemList.concat([
        getBreadcrumbs(
            navigationDictionary[0][dictionaryId][0],
            activeNavigationConfigId,
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
            activeNavigationConfigId,
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
        navigationConfigId,
        dictionaryId,
        navigationConfigId,
        handleClick
    ).reverse();
}
