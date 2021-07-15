/// <reference types="react" />
import { NavigationConfigDictionary, TreeNavigation } from "@microsoft/fast-tooling";
import { BreadcrumbItemEventHandler } from "../form.props";
export interface BreadcrumbItem {
    href: string;
    text: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
export declare type HandleBreadcrumbClick = (
    dictionaryId: string,
    navigationConfigId: string
) => BreadcrumbItemEventHandler;
/**
 * Gets breadcrumbs from navigation items
 */
export declare function getBreadcrumbs(
    navigation: TreeNavigation,
    activeNavigationConfigId: string,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[];
/**
 * Resolve breadcrumbs from navigation dictionary
 */
export declare function resolveDictionaryBreadcrumbs(
    navigationDictionary: NavigationConfigDictionary,
    activeNavigationConfigId: string,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick,
    breadcrumbItemList?: BreadcrumbItem[][]
): BreadcrumbItem[];
/**
 * Get breadcrumbs from navigation dictionary
 */
export declare function getDictionaryBreadcrumbs(
    navigationDictionary: NavigationConfigDictionary,
    dictionaryId: string,
    navigationConfigId: string,
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[];
