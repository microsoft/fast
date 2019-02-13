import * as React from "react";
import { cloneDeep, get, mergeWith } from "lodash-es";
import {
    ChildOptionItem,
    getChildOptionBySchemaId,
    getDataLocationsOfChildren,
    getPartialData,
    mapSchemaLocationFromDataLocation,
    normalizeDataLocation,
} from "@microsoft/fast-data-utilities-react";
import { BreadcrumbItemEventHandler, FormState } from "./form.props";
import { reactChildrenStringSchema } from "./form-item.children.text";

const squareBracketsRegex: RegExp = /\[(\d+?)\]/g;
const propsKeyword: string = "props";

export enum PropertyKeyword {
    properties = "properties",
    reactProperties = "reactProperties",
}

export interface NavigationItem {
    dataLocation: string;
    schemaLocation: string;
    title: string;
    data: any;
    schema: any;
}

export interface NavigationItem {
    dataLocation: string;
    data: any;
    schema: any;
}

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
 * Gets the data cache based on a new data object and
 * previous data object
 */
export function getDataCache(dataCache: any, newData: any): any {
    let newDataCache: any =
        typeof dataCache !== "undefined" ? cloneDeep(dataCache) : newData;

    if (newDataCache !== newData) {
        newDataCache = mergeWith(dataCache, newData, cachedArrayResolver);
    }

    return newDataCache;
}

/**
 * Resolves arrays when the object is an array and the data passed is an array
 */
function cachedArrayResolver(objValue: any, srcValue: any): any {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        return srcValue;
    }
}

/**
 * Determines the navigation from
 * - section links
 * - child components
 * - array items
 * - breadcrumb links
 */
export function getActiveComponentAndSection(
    schemaLocation: string,
    dataLocation: string,
    schema?: any
): Partial<FormState> {
    const state: any = {};

    state.activeDataLocation = dataLocation;
    state.activeSchemaLocation = schemaLocation;

    // if the schema is undefined its most likely an array
    if (typeof schema !== "undefined") {
        state.schema = schema;
        state.titleProps = schema.title || "Untitled";
    }

    return state;
}

/**
 * Gets locations from individual location segments
 * Example:
 * getLocationsFromSegments(["children[0].props.object"])
 * output: ["children[0]", "children[0].props", "children[0].props.object"]
 */
export function getLocationsFromSegments(segments: string[]): string[] {
    return segments.map((location: string, index: number) => {
        return segments.slice(0, index + 1).join(".");
    });
}

/**
 * Gets the navigational items
 */
export function getNavigation(
    dataLocation: string,
    data: any,
    schema: any,
    childOptions: ChildOptionItem[]
): NavigationItem[] {
    const allChildOptions: ChildOptionItem[] = getReactDefaultChildren().concat(
        childOptions
    );
    const dataLocationsOfChildren: string[] = getDataLocationsOfChildren(
        schema,
        data,
        allChildOptions
    );
    const normalizedDataLocation: string = !dataLocationsOfChildren.includes(dataLocation)
        ? normalizeDataLocation(dataLocation, data)
        : typeof get(data, dataLocation) === "string"
            ? normalizeDataLocation(dataLocation, data)
            : `${normalizeDataLocation(dataLocation, data)}.${propsKeyword}`;
    const dataLocations: Set<string> = new Set(
        [""].concat(getLocationsFromSegments(normalizedDataLocation.split(".")))
    );
    const navigationItems: NavigationItem[] = [];
    let currentComponentSchema: any = schema;
    let lastComponentDataLocation: string = "";

    dataLocations.forEach((dataLocationItem: string) => {
        if (dataLocationsOfChildren.includes(dataLocationItem)) {
            const isChildString: boolean =
                typeof get(data, dataLocationItem) === "string";
            currentComponentSchema = getSchemaByDataLocation(
                schema,
                data,
                dataLocationItem,
                allChildOptions
            );
            lastComponentDataLocation = isChildString
                ? dataLocationItem
                : `${dataLocationItem}.${propsKeyword}`;

            if (isChildString) {
                navigationItems.push(
                    getNavigationItem(
                        dataLocationItem,
                        "",
                        reactChildrenStringSchema,
                        data
                    )
                );
            }
        } else {
            const isRoot: boolean = isRootLocation(lastComponentDataLocation);
            const dataLocationFromLastComponent: string = getCurrentComponentDataLocation(
                dataLocationItem,
                lastComponentDataLocation
            );
            let currentSchemaLocation: string = mapSchemaLocationFromDataLocation(
                isRoot ? dataLocationItem : dataLocationFromLastComponent,
                isRoot ? data : get(data, dataLocationItem),
                currentComponentSchema
            );
            const currentSchemaLocationSegments: string[] = currentSchemaLocation.split(
                "."
            );
            const currentSchemaLocationSegmentsLength: number =
                currentSchemaLocationSegments.length;
            if (
                !isNaN(
                    parseInt(
                        currentSchemaLocationSegments[
                            currentSchemaLocationSegmentsLength - 1
                        ],
                        10
                    )
                ) &&
                (currentSchemaLocationSegments[
                    currentSchemaLocationSegmentsLength - 2
                ] === "oneOf" ||
                    currentSchemaLocationSegments[
                        currentSchemaLocationSegmentsLength - 2
                    ] === "anyOf")
            ) {
                currentSchemaLocation = currentSchemaLocationSegments
                    .slice(0, currentSchemaLocationSegmentsLength - 2)
                    .join(".");
            }

            const currentSchema: any =
                dataLocationFromLastComponent === ""
                    ? currentComponentSchema
                    : get(currentComponentSchema, currentSchemaLocation);

            navigationItems.push(
                getNavigationItem(
                    dataLocationItem,
                    currentSchemaLocation,
                    currentSchema,
                    data
                )
            );
        }
    });

    return navigationItems;
}

/**
 * Get a single navigation item
 */
export function getNavigationItem(
    dataLocation: string,
    schemaLocation: string,
    schema: any,
    data: any
): NavigationItem {
    return {
        dataLocation,
        schemaLocation,
        title: schema.title || "Untitled",
        data: getPartialData(dataLocation, data),
        schema,
    };
}

/**
 * Get React's default children
 */
export function getReactDefaultChildren(): ChildOptionItem[] {
    return [
        {
            name: "Text",
            component: null,
            schema: reactChildrenStringSchema,
        },
    ];
}

/**
 * Gets the data location from the current component
 */
export function getCurrentComponentDataLocation(
    dataLocation: string,
    lastComponentDataLocation: string
): string {
    return dataLocation.replace(lastComponentDataLocation, "").replace(/^\./, "");
}

/**
 * Removes any references to array index
 */
export function normalizeSchemaLocation(schemaLocation: string): string {
    return schemaLocation.replace(squareBracketsRegex, "");
}

/**
 * Check to see if we are on the root location
 */
export function isRootLocation(location: string): boolean {
    return location === "";
}

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

/**
 * Finds the schema using the data location
 */
export function getSchemaByDataLocation(
    currentSchema: any,
    data: any,
    dataLocation: string,
    childOptions: ChildOptionItem[]
): any {
    if (dataLocation === "") {
        return currentSchema;
    }

    const subData: any = get(data, dataLocation);
    const id: string | undefined = subData ? subData.id : void 0;
    const childOptionWithMatchingSchemaId: any = childOptions.find(
        (childOption: ChildOptionItem) => {
            return childOption.schema.id === id;
        }
    );

    return childOptionWithMatchingSchemaId
        ? childOptionWithMatchingSchemaId.schema
        : currentSchema;
}

/**
 * Finds the component using the schema id
 */
export function getComponentByDataLocation(
    id: string,
    childOptions: ChildOptionItem[]
): any {
    const childOption: ChildOptionItem = getChildOptionBySchemaId(id, childOptions);

    return childOption ? childOption.component : null;
}
