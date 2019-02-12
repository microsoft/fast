import { get } from "lodash-es";
import {
    ChildOptionItem,
    getDataLocationsOfChildren,
} from "@microsoft/fast-data-utilities-react";
import { ItemType, TreeNavigation } from "./navigation.props";

function getDataLocationParentLocation(
    dataLocations: string[],
    dataLocation: string
): string | void {
    const dataLocationsWithoutDataLocation: string[] = dataLocations.filter(
        (dataLocationItem: string) => dataLocationItem !== dataLocation
    );
    const dataLocationParentLocations: string[] = dataLocationsWithoutDataLocation.filter(
        (dataLocationsItem: string) =>
            dataLocationsItem.length < dataLocation.length &&
            dataLocation.slice(0, dataLocationsItem.length) === dataLocationsItem
    );

    return dataLocationParentLocations.sort(
        (a: string, b: string) => (a.length > b.length ? -1 : 1)
    )[0];
}

function getNavigationFromChildLocations(
    navigation: TreeNavigation[],
    childrenDataLocations: string[],
    data: any,
    childOptions: ChildOptionItem[]
): TreeNavigation[] {
    const updatedNavigation: TreeNavigation[] = [].concat(navigation);

    childrenDataLocations.forEach(
        (childrenDataLocation: string): void => {
            const parentLocation: string | void = getDataLocationParentLocation(
                childrenDataLocations,
                childrenDataLocation
            );

            // check against other data locations to determine where this item should be set
            if (parentLocation) {
                updatedNavigation.forEach(
                    (navigationItem: TreeNavigation): void => {
                        if (navigationItem.dataLocation === parentLocation) {
                            navigationItem.items = Array.isArray(navigationItem.items)
                                ? navigationItem.items
                                : [];

                            // slice out all childrenDataLocations that no longer match
                            const matchingChildren: string[] = childrenDataLocations.filter(
                                (childrenDataLocationItem: string) => {
                                    return (
                                        childrenDataLocationItem.slice(
                                            0,
                                            parentLocation.length
                                        ) === parentLocation &&
                                        childrenDataLocationItem !== parentLocation
                                    );
                                }
                            );

                            navigationItem.items = getNavigationFromChildLocations(
                                navigationItem.items,
                                matchingChildren,
                                data,
                                childOptions
                            );
                        }
                    }
                );
            } else {
                // make sure the item hasn't already been added to the items array
                const itemAdded: TreeNavigation = updatedNavigation.find(
                    (updatedNavigationItem: TreeNavigation) => {
                        return (
                            updatedNavigationItem.dataLocation === childrenDataLocation
                        );
                    }
                );

                if (!!!itemAdded) {
                    const subSchema: any = childOptions.find(
                        (childOption: ChildOptionItem) =>
                            get(data, childrenDataLocation).id === childOption.schema.id
                    );

                    updatedNavigation.push({
                        text: get(subSchema, "schema.title")
                            ? subSchema.schema.title
                            : typeof get(data, childrenDataLocation) === "string"
                                ? get(data, childrenDataLocation)
                                : "Undefined",
                        dataLocation: childrenDataLocation,
                        type: ItemType.children,
                    });
                }
            }
        }
    );

    return updatedNavigation;
}

export function getNavigationFromData(
    data: any,
    schema: any,
    childOptions: ChildOptionItem[]
): TreeNavigation {
    const childrenDataLocations: string[] = getDataLocationsOfChildren(
        schema,
        data,
        childOptions
    );

    const navigation: TreeNavigation[] = getNavigationFromChildLocations(
        [],
        childrenDataLocations,
        data,
        childOptions
    );

    return {
        text: schema.title ? schema.title : "Undefined",
        dataLocation: "",
        items: navigation,
        type: ItemType.children,
    };
}
