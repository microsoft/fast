import { dictionaryLink } from "@microsoft/fast-tooling";
import { DataType } from "@microsoft/fast-tooling";
/**
 * Gets breadcrumbs from navigation items
 */
export function getBreadcrumbs(
    navigation,
    activeNavigationConfigId,
    dictionaryId,
    navigationConfigId,
    handleClick
) {
    let navigationItems = [];
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
    navigationDictionary,
    activeNavigationConfigId,
    dictionaryId,
    navigationConfigId,
    handleClick,
    breadcrumbItemList = []
) {
    const breadcrumbItems = breadcrumbItemList.concat([
        getBreadcrumbs(
            navigationDictionary[0][dictionaryId][0],
            activeNavigationConfigId,
            dictionaryId,
            navigationConfigId,
            handleClick
        ),
    ]);
    const breadcrumbParent =
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
    return breadcrumbItems.reduce((accum, breadcrumbItem) => {
        return accum.concat(breadcrumbItem);
    }, []);
}
/**
 * Get breadcrumbs from navigation dictionary
 */
export function getDictionaryBreadcrumbs(
    navigationDictionary,
    dictionaryId,
    navigationConfigId,
    handleClick
) {
    return resolveDictionaryBreadcrumbs(
        navigationDictionary,
        navigationConfigId,
        dictionaryId,
        navigationConfigId,
        handleClick
    ).reverse();
}
