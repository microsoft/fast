import { get } from "lodash-es";
import { ChildOptionItem } from "../data-utilities";
import { mapSchemaLocationFromDataLocation } from "../data-utilities/location";
import { NavigationDataType, TreeNavigation } from "./navigation.props";
import {
    idKeyword,
    itemsKeyword,
    PropertyKeyword,
    typeKeyword,
} from "../data-utilities/types";

const propsKeyword: string = "props";

export interface NavigationFromChildrenConfig {
    data: any;
    schema: any;
    dataLocation: string;
    childOptions: ChildOptionItem[];
}

/**
 * Gets the data type from a navigation item
 */
function getNavigationDataType(schema: any): NavigationDataType {
    return schema[typeKeyword]
        ? schema[typeKeyword]
        : schema[PropertyKeyword.properties] || schema[PropertyKeyword.reactProperties]
            ? NavigationDataType.object
            : schema[itemsKeyword]
                ? NavigationDataType.array
                : NavigationDataType.object;
}

/**
 * Gets navigation from a data location which follows
 * lodash path syntax
 */
function getNavigationFromDataLocations(
    data: any,
    schema: any,
    childOptions: ChildOptionItem[],
    dataLocation: string = "",
    relativeDataLocation: string = "" // This data location is relative to the current schema
): TreeNavigation[] | void {
    if (typeof data !== "object" && data !== null) {
        return void 0;
    }

    const dataPropertyKeys: string[] = Object.keys(data);
    const propertyKeyLength: number = dataPropertyKeys.length;
    const navigationItems: TreeNavigation[] = [];

    for (let i: number = 0; i < propertyKeyLength; i++) {
        const updatedRelativeDataLocation: string =
            relativeDataLocation === ""
                ? dataPropertyKeys[i]
                : [relativeDataLocation, dataPropertyKeys[i]].join(".");
        const updatedDataLocation: string =
            dataLocation === ""
                ? dataPropertyKeys[i]
                : [dataLocation, dataPropertyKeys[i]].join(".");
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            updatedRelativeDataLocation,
            schema,
            data
        );
        const subSchema: any = get(schema, schemaLocation);
        const dataType: NavigationDataType | null =
            typeof subSchema !== "undefined" ? getNavigationDataType(subSchema) : null;
        const dataFromDataLocation: any = get(data, updatedRelativeDataLocation);
        let text: string;

        switch (dataType) {
            case NavigationDataType.children:
                navigationItems.push(
                    getNavigationFromChildren({
                        data: dataFromDataLocation,
                        schema: subSchema,
                        dataLocation: updatedDataLocation,
                        childOptions,
                    })
                );

                break;
            case NavigationDataType.object:
            case NavigationDataType.array:
                text = get(subSchema, "title") ? subSchema.title : "Undefined";
                navigationItems.push({
                    text,
                    dataLocation: updatedDataLocation,
                    type: dataType,
                    items: getNavigationFromDataLocations(
                        get(data, updatedRelativeDataLocation),
                        get(schema, schemaLocation),
                        childOptions,
                        updatedDataLocation
                    ),
                });
                break;
            default:
                break;
        }
    }

    return navigationItems.length > 0 ? navigationItems : void 0;
}

/**
 * gets navigation from react children
 */
function getNavigationFromChildren(config: NavigationFromChildrenConfig): TreeNavigation {
    const childrenTreeNavigation: TreeNavigation = {
        text: get(config.schema, "title") ? config.schema.title : "Undefined",
        dataLocation: config.dataLocation,
        type: NavigationDataType.children,
    };

    if (Array.isArray(config.data) && config.data.length !== 0) {
        const dataLength: number = config.data.length;
        childrenTreeNavigation.items = [];

        for (let i: number = 0; i < dataLength; i++) {
            childrenTreeNavigation.items.push(
                getNavigationFromChildrenItem({
                    data: config.data[i],
                    schema: config.schema,
                    dataLocation: `${config.dataLocation}${
                        config.dataLocation !== "" ? "." : ""
                    }${i}`,
                    childOptions: config.childOptions,
                })
            );
        }
    } else {
        childrenTreeNavigation.items = [getNavigationFromChildrenItem(config)];
    }

    return childrenTreeNavigation;
}

/**
 * gets navigation from a single react child
 */
function getNavigationFromChildrenItem(
    config: NavigationFromChildrenConfig
): TreeNavigation {
    const childSchema: any = get(
        config.childOptions.find(
            (childOption: ChildOptionItem) =>
                get(config.data, idKeyword) === get(childOption, "schema.id")
        ),
        "schema"
    );
    const isString: boolean = typeof config.data === "string";
    const text: string = isString
        ? config.data
        : get(childSchema, "title")
            ? childSchema.title
            : "Undefined";
    const updatedDataLocation: string = `${config.dataLocation}${
        config.dataLocation === "" || isString ? "" : "."
    }${isString ? "" : propsKeyword}`;
    const childTreeNavigation: TreeNavigation = {
        text,
        dataLocation: updatedDataLocation,
        type: NavigationDataType.childrenItem,
    };

    if (!!childSchema && !isString) {
        childTreeNavigation.items = getNavigationFromDataLocations(
            get(config.data, propsKeyword),
            childSchema,
            config.childOptions,
            updatedDataLocation
        );
    }

    return childTreeNavigation;
}

/**
 * Gets tree navigation data
 */
export function getNavigationFromData(
    data: any,
    schema: any,
    childOptions: ChildOptionItem[]
): TreeNavigation {
    const navigation: TreeNavigation[] | void = getNavigationFromDataLocations(
        data,
        schema,
        childOptions
    );

    return {
        text: schema.title ? schema.title : "Undefined",
        dataLocation: "",
        items: navigation,
        type: getNavigationDataType(schema),
    };
}
