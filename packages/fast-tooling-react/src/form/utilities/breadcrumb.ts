import { BreadcrumbItemEventHandler } from "../form/form.props";
import { NavigationItem } from "./navigation";

export interface BreadcrumbItem {
    href: string;
    text: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type HandleBreadcrumbClick = (
    schemaLocation: string,
    dataLocation: string,
    schema: any
) => BreadcrumbItemEventHandler;

/**
 * Gets breadcrumbs from navigation items
 */
export function getBreadcrumbs(
    navigation: NavigationItem[],
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[] {
    return navigation.map(
        (navigationItem: NavigationItem): BreadcrumbItem => {
            return {
                href: navigationItem.dataLocation,
                text: navigationItem.title,
                onClick: handleClick(
                    navigationItem.schemaLocation,
                    navigationItem.dataLocation,
                    navigationItem.schema
                ),
            };
        }
    );
}
