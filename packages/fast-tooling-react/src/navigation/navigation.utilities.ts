import { cloneDeep, get, set, unset } from "lodash-es";
import { ChildOptionItem } from "../data-utilities";
import { mapSchemaLocationFromDataLocation } from "../data-utilities/location";
import { NavigationDataType, TreeNavigation } from "./navigation.props";
import {
    idKeyword,
    itemsKeyword,
    PropertyKeyword,
    typeKeyword,
} from "../data-utilities/types";
import { VerticalDragDirection } from "./navigation-tree-item.props";

const propsKeyword: string = "props";

export interface NavigationFromChildrenConfig {
    data: any;
    schema: any;
    dataLocation: string;
    childOptions: ChildOptionItem[];
}

export interface TargetDataConfig {
    targetDataLocation: string;
    updatedTargetData: any;
}

export interface UpdatedDataCommonConfig {
    data: any;
    updatedSourceData: any;
    direction: VerticalDragDirection;
}

export interface UpdatedDataConfig extends UpdatedDataCommonConfig {
    targetDataLocation: string;
    sourceDataLocation: string;
    type: NavigationDataType;
}

export interface ArrayTargetConfig extends UpdatedDataCommonConfig {
    targetDataLocationNormalizedLastSegmentAsNumber: number;
    targetDataLocationNormalizedSegments: string[];
    sourceDataLocation: string;
}

export interface ObjectTargetConfig extends UpdatedDataCommonConfig {
    targetDataLocation: string;
    targetDataLocationNormalizedSegments: string[];
}

export interface UpdatedDataListConfig extends UpdatedDataCommonConfig {
    targetDataLocation: string;
    sourceDataLocation: string;
}

export interface SourceArrayMatchesTargetArrayConfig extends UpdatedDataCommonConfig {
    sourceDataLocation: string;
    targetDataLocationNormalizedLastSegmentAsNumber: number;
    targetArrayDataLocation: string;
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

/**
 * Gets a normalized source data location that can be used for setting/getting data
 */
export function getDataLocationNormalized(dataLocation: string): string {
    const dataLocationNormalized: string = dataLocation.endsWith(`.${propsKeyword}`)
        ? dataLocation.slice(0, -6)
        : dataLocation;

    return dataLocationNormalized;
}

/**
 * Removes the source data
 */
export function getUpdatedDataWithoutSourceData(
    data: any,
    sourceDataLocation: string
): any {
    const updatedData: any = cloneDeep(data);

    // determine if the source is an array
    const sourceDataLocationNormalized: string = getDataLocationNormalized(
        sourceDataLocation
    );
    const sourceDataLocationSegments: string[] = sourceDataLocationNormalized.split(".");
    const lastSourceDataLocationSegmentAsNumber: number = Number(
        sourceDataLocationSegments[sourceDataLocationSegments.length - 1]
    );

    // Remove the item from the data
    if (!isNaN(lastSourceDataLocationSegmentAsNumber)) {
        sourceDataLocationSegments.pop();
        const arrayDataLocation: string = sourceDataLocationSegments.join(".");
        const array: any[] = get(updatedData, arrayDataLocation);
        array.splice(lastSourceDataLocationSegmentAsNumber, 1);

        // if there is only one item left in the children array, make it an object
        set(updatedData, arrayDataLocation, array.length === 1 ? array[0] : array);
    } else {
        unset(updatedData, sourceDataLocationNormalized);
    }

    return updatedData;
}

/**
 * Returns updated data when the target is children list parent
 */
function getUpdatedDataWithTargetDataAddedToChildren(
    data: any,
    updatedTargetData: any,
    updatedSourceData: any,
    targetDataLocation: string
): any {
    const updatedData: any = cloneDeep(data);

    if (Array.isArray(updatedTargetData)) {
        set(
            updatedData,
            targetDataLocation,
            updatedTargetData.concat([updatedSourceData])
        );
    } else if (typeof updatedTargetData !== "undefined") {
        set(updatedData, targetDataLocation, [updatedTargetData, updatedSourceData]);
    } else {
        set(updatedData, targetDataLocation, updatedSourceData);
    }

    return updatedData;
}

/**
 * Returns target data when the source and target location are the same
 */
function getTargetDataWhenSourceArrayIsTargetArray(
    config: SourceArrayMatchesTargetArrayConfig
): any {
    const targetArrayIndex: number =
        getLastDataLocationSegmentAsNumber(config.sourceDataLocation) <
        config.targetDataLocationNormalizedLastSegmentAsNumber
            ? config.targetDataLocationNormalizedLastSegmentAsNumber - 1
            : config.targetDataLocationNormalizedLastSegmentAsNumber;
    let updatedTargetData: any = get(config.data, config.targetArrayDataLocation);

    if (!Array.isArray(updatedTargetData)) {
        updatedTargetData = [updatedTargetData];
        updatedTargetData.splice(
            config.direction === VerticalDragDirection.up ? 0 : 1,
            0,
            config.updatedSourceData
        );
    } else {
        updatedTargetData.splice(
            config.direction === VerticalDragDirection.up
                ? targetArrayIndex
                : targetArrayIndex + 1,
            0,
            config.updatedSourceData
        );
    }

    return updatedTargetData;
}

/**
 * Returns updated data with the targets data added the children items
 */
function getUpdatedDataWithTargetDataAddedToChildrenList(
    config: UpdatedDataListConfig
): any {
    const updatedData: any = cloneDeep(config.data);

    // determine if this is an array
    const targetDataLocationNormalizedSegments: string[] = getDataLocationNormalized(
        config.targetDataLocation
    ).split(".");
    const targetDataLocationNormalizedLastSegment: string =
        targetDataLocationNormalizedSegments[
            targetDataLocationNormalizedSegments.length - 1
        ];
    const targetDataLocationNormalizedLastSegmentAsNumber: number = parseInt(
        targetDataLocationNormalizedLastSegment,
        10
    );

    // The target is an array
    if (!isNaN(targetDataLocationNormalizedLastSegmentAsNumber)) {
        const target: TargetDataConfig = getTargetDataAndTargetDataLocationWhenTargetIsInAnArray(
            {
                data: updatedData,
                updatedSourceData: config.updatedSourceData,
                targetDataLocationNormalizedLastSegmentAsNumber,
                targetDataLocationNormalizedSegments,
                sourceDataLocation: config.sourceDataLocation,
                direction: config.direction,
            }
        );
        set(updatedData, target.targetDataLocation, target.updatedTargetData);
    } else {
        const target: TargetDataConfig = getTargetDataAndTargetDataLocation({
            data: updatedData,
            updatedSourceData: config.updatedSourceData,
            targetDataLocation: config.targetDataLocation,
            targetDataLocationNormalizedSegments,
            direction: config.direction,
        });
        set(updatedData, target.targetDataLocation, target.updatedTargetData);
    }

    return updatedData;
}

/**
 * Gets the targets data and data location when the target is an object
 */
function getTargetDataAndTargetDataLocation(
    config: ObjectTargetConfig
): TargetDataConfig {
    const targetDataLocationObject: string = config.targetDataLocationNormalizedSegments.join(
        "."
    );
    let updatedTargetData: any = get(config.data, targetDataLocationObject);

    if (typeof updatedTargetData !== "undefined") {
        updatedTargetData = [updatedTargetData];
        updatedTargetData.splice(
            config.direction === VerticalDragDirection.up ? 0 : 1,
            0,
            config.updatedSourceData
        );

        return {
            targetDataLocation: targetDataLocationObject,
            updatedTargetData,
        };
    }

    return {
        targetDataLocation: config.targetDataLocation,
        updatedTargetData: config.updatedSourceData,
    };
}

/**
 * Gets the targets data and data location when the target is an array
 */
function getTargetDataAndTargetDataLocationWhenTargetIsInAnArray(
    config: ArrayTargetConfig
): TargetDataConfig {
    config.targetDataLocationNormalizedSegments.pop();
    const targetDataLocation: string = config.targetDataLocationNormalizedSegments.join(
        "."
    );
    // determine if the source array is the same as the target array
    const sourceArrayIsTargetArray: boolean = isSourceArrayTargetArray(
        config.sourceDataLocation,
        targetDataLocation
    );

    // if the source location is the same as the target location
    // we must account for the new index being used
    if (sourceArrayIsTargetArray) {
        return {
            targetDataLocation,
            updatedTargetData: getTargetDataWhenSourceArrayIsTargetArray({
                data: config.data,
                updatedSourceData: config.updatedSourceData,
                sourceDataLocation: config.sourceDataLocation,
                targetDataLocationNormalizedLastSegmentAsNumber:
                    config.targetDataLocationNormalizedLastSegmentAsNumber,
                targetArrayDataLocation: targetDataLocation,
                direction: config.direction,
            }),
        };
    }
    const updatedTargetData: any = get(config.data, targetDataLocation);

    updatedTargetData.splice(
        config.direction === VerticalDragDirection.up
            ? config.targetDataLocationNormalizedLastSegmentAsNumber
            : config.targetDataLocationNormalizedLastSegmentAsNumber + 1,
        0,
        config.updatedSourceData
    );
    return {
        targetDataLocation,
        updatedTargetData,
    };
}

/**
 * Returns the last segment as a number
 */
function getLastDataLocationSegmentAsNumber(dataLocation: string): number {
    const dataLocationNormalized: string = getDataLocationNormalized(dataLocation);
    const dataLocationSegments: string[] = dataLocationNormalized.split(".");
    return Number(dataLocationSegments.pop());
}

/**
 * Check to see if the source location of an array is the same as the target location
 */
function isSourceArrayTargetArray(
    sourceDataLocation: string,
    targetDataLocation: string
): boolean {
    const sourceDataLocationNormalized: string = getDataLocationNormalized(
        sourceDataLocation
    );
    const sourceDataLocationSegments: string[] = sourceDataLocationNormalized.split(".");
    const lastSourceDataLocationSegmentAsNumber: number = Number(
        sourceDataLocationSegments.pop()
    );

    if (!isNaN(lastSourceDataLocationSegmentAsNumber)) {
        return targetDataLocation === sourceDataLocationSegments.join(".");
    }

    return targetDataLocation === sourceDataLocationNormalized;
}

/**
 * Updates the target data with the source data
 */
export function getUpdatedDataWithTargetData(config: UpdatedDataConfig): any {
    let updatedData: any;
    const updatedTargetData: any = get(config.data, config.targetDataLocation);

    switch (config.type) {
        case NavigationDataType.children:
            updatedData = getUpdatedDataWithTargetDataAddedToChildren(
                config.data,
                updatedTargetData,
                config.updatedSourceData,
                config.targetDataLocation
            );
            break;
        case NavigationDataType.childrenItem:
            updatedData = getUpdatedDataWithTargetDataAddedToChildrenList({
                data: config.data,
                updatedSourceData: config.updatedSourceData,
                targetDataLocation: config.targetDataLocation,
                sourceDataLocation: config.sourceDataLocation,
                direction: config.direction,
            });
            break;
    }

    return updatedData;
}
