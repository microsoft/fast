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
import { isInArray } from "../data-utilities/array";
import { VerticalDragDirection } from "./navigation-tree-item.props";

const propsKeyword: string = "props";
const childrenKeyword: string = "children";

export interface NavigationFromChildrenConfig {
    data: any;
    schema: any;
    dataLocation: string;
    childOptions: ChildOptionItem[];
}

export interface UpdateDataConfig {
    targetDataLocation: string;
    sourceDataLocation: string;
    data: unknown;
    type: NavigationDataType;
    direction: VerticalDragDirection;
}

export interface ResolveDataConfig {
    data: unknown;
    dataLocation: string;
}

export interface ResolveTargetDataConfig extends ResolveDataConfig {
    direction: VerticalDragDirection;
    type: NavigationDataType;
    sourceData: unknown;
}

/**
 * Gets the data type from a navigation item
 */
function getNavigationDataType(schema: any): NavigationDataType {
    return schema.$schema // The $schema keyword is required to be present on the root of a JSON schema
        ? NavigationDataType.component
        : schema[typeKeyword]
            ? schema[typeKeyword]
            : schema[PropertyKeyword.properties] ||
              schema[PropertyKeyword.reactProperties]
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
    relativeDataLocation: string = "", // This data location is relative to the current schema
    isArrayItem: boolean
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
        const dataFromDataLocation: any = get(data, updatedRelativeDataLocation);
        const updatedDataLocation: string =
            dataLocation === "" && isArrayItem
                ? `[${dataPropertyKeys[i]}]`
                : dataLocation === ""
                    ? dataPropertyKeys[i]
                    : isArrayItem
                        ? `${dataLocation}[${dataPropertyKeys[i]}]`
                        : [dataLocation, dataPropertyKeys[i]].join(".");
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            updatedRelativeDataLocation,
            schema,
            data
        );
        const subSchema: any = get(schema, schemaLocation);
        const dataType: NavigationDataType | null =
            typeof subSchema !== "undefined" ? getNavigationDataType(subSchema) : null;
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
                        updatedDataLocation,
                        "",
                        Array.isArray(dataFromDataLocation)
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
                    dataLocation: `${config.dataLocation}[${i}]`,
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
        type:
            typeof config.data === "string" ||
            typeof config.data === "number" ||
            typeof config.data === "boolean"
                ? NavigationDataType.primitiveChild
                : NavigationDataType.component,
    };

    if (!!childSchema && !isString) {
        childTreeNavigation.items = getNavigationFromDataLocations(
            get(config.data, propsKeyword),
            childSchema,
            config.childOptions,
            updatedDataLocation,
            "",
            false
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
        childOptions,
        "",
        "",
        Array.isArray(data)
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
    return dataLocation.endsWith(`.${propsKeyword}`)
        ? dataLocation.slice(0, -6)
        : dataLocation;
}

export function getUpdatedData<T>(config: UpdateDataConfig): T {
    const clonedData: T = cloneDeep(config.data) as T;
    const normalizedTargetDataLocation: string = getDataLocationNormalized(
        config.targetDataLocation
    );

    // do not allow dropping onto the root item
    if (normalizedTargetDataLocation === "") {
        return clonedData;
    }

    const normalizedSourceDataLocation: string = getDataLocationNormalized(
        config.sourceDataLocation
    );
    const targetInArray: boolean = isInArray(clonedData, normalizedTargetDataLocation);
    const sourceInArray: boolean = isInArray(clonedData, normalizedSourceDataLocation);
    const targetInSourceArray: boolean = isTargetInSourceArray(
        targetInArray && sourceInArray,
        normalizedTargetDataLocation,
        normalizedSourceDataLocation
    );
    const targetIsNotUndefined: boolean =
        normalizedTargetDataLocation !== ""
            ? typeof get(clonedData, normalizedTargetDataLocation) !== "undefined"
            : typeof clonedData !== "undefined";
    // this determines the sequence of setting data
    // if the source is below the target, then unset the source data first
    // if the source is above the target, then set the target data first
    const targetNestedBelowSource: boolean = isTargetNestedBelowSource(
        normalizedSourceDataLocation,
        normalizedTargetDataLocation
    );

    if (targetInSourceArray) {
        setDataWhenTargetInSourceArray(
            clonedData,
            normalizedSourceDataLocation,
            normalizedTargetDataLocation,
            config.direction,
            targetNestedBelowSource,
            config.type
        );
    } else if (targetInArray && sourceInArray) {
        setDataWhenTargetInArrayAndSourceInArray(
            clonedData,
            normalizedSourceDataLocation,
            normalizedTargetDataLocation,
            config.direction,
            targetNestedBelowSource,
            config.type
        );
    } else if (targetInArray) {
        setDataWhenTargetInArray(
            clonedData,
            normalizedSourceDataLocation,
            normalizedTargetDataLocation,
            config.direction,
            targetNestedBelowSource,
            config.type
        );
    } else if (sourceInArray) {
        setDataWhenSourceInArray(
            clonedData,
            normalizedSourceDataLocation,
            normalizedTargetDataLocation,
            config.direction,
            targetNestedBelowSource,
            config.type
        );
    } else if (targetIsNotUndefined) {
        setDataWhenTargetInObjectAndSourceInObject(
            clonedData,
            normalizedSourceDataLocation,
            normalizedTargetDataLocation,
            config.direction,
            targetNestedBelowSource,
            config.type
        );
    } else {
        setDataWhenTargetIsUndefined(
            clonedData,
            normalizedSourceDataLocation,
            normalizedTargetDataLocation
        );
    }

    return clonedData;
}

function isTargetNestedBelowSource(
    sourceDataLocation: string,
    targetDataLocation: string
): boolean {
    const sourceDataLocationSegments: string[] = sourceDataLocation.split(".");
    const targetDataLocationSegments: string[] = targetDataLocation.split(".");

    for (
        let i: number = 0,
            sourceDataLocationSegmentsLength: number = sourceDataLocationSegments.length;
        i < sourceDataLocationSegmentsLength;
        i++
    ) {
        const sourceDataLocationSegmentIndex: number = parseInt(
            sourceDataLocationSegments[i],
            10
        );
        const targetDataLocationSegmentIndex: number = parseInt(
            targetDataLocationSegments[i],
            10
        );

        if (
            typeof targetDataLocationSegments[i] === "undefined" ||
            (isNaN(sourceDataLocationSegmentIndex) &&
                isNaN(targetDataLocationSegmentIndex) &&
                sourceDataLocationSegments[i] !== targetDataLocationSegments[i])
        ) {
            break;
        }

        if (
            !isNaN(sourceDataLocationSegmentIndex) &&
            !isNaN(targetDataLocationSegmentIndex)
        ) {
            return sourceDataLocationSegmentIndex < targetDataLocationSegmentIndex;
        }
    }

    return false;
}

/**
 * The target array is the same as the source array
 */
function isTargetInSourceArray(
    targetAndSourceAreInArray: boolean,
    targetDataLocation: string,
    sourceDataLocation: string
): boolean {
    if (!targetAndSourceAreInArray) {
        return false;
    }

    const targetDataLocationSegments: string[] = targetDataLocation.split(".");
    const sourceDataLocationSegments: string[] = sourceDataLocation.split(".");
    const targetParentDataLocation: string = targetDataLocationSegments
        .slice(0, -1)
        .join(".");
    const sourceParentDataLocation: string = sourceDataLocationSegments
        .slice(0, -1)
        .join(".");

    return targetParentDataLocation === sourceParentDataLocation;
}

function setDataOnDropVerticalCenter(
    data: any,
    targetData: any,
    sourceData: any,
    targetDataLocation: string,
    type: NavigationDataType
): void {
    const isComponent: boolean = type === NavigationDataType.component;

    if (isComponent) {
        const componentChildren: unknown = get(
            targetData,
            `${propsKeyword}.${childrenKeyword}`
        );
        targetDataLocation = `${targetDataLocation}.${propsKeyword}.${childrenKeyword}`;

        if (typeof componentChildren === "undefined") {
            set(data as object, targetDataLocation, sourceData);
        } else if (Array.isArray(componentChildren)) {
            componentChildren.push(sourceData);
        } else {
            set(
                data as object,
                targetDataLocation,
                [componentChildren].concat(sourceData)
            );
        }
    } else {
        set(data as object, targetDataLocation, [sourceData].concat(targetData));
    }
}

function setDataWhenTargetInSourceArray(
    data: unknown,
    sourceDataLocation: string,
    targetDataLocation: string,
    direction: VerticalDragDirection,
    targetNestedBelowSource: boolean,
    type: NavigationDataType
): void {
    const sourceData: unknown = get(data, sourceDataLocation);
    const targetData: unknown = get(data, targetDataLocation);
    const sourceDataLocationSegments: string[] = sourceDataLocation.split(".");
    const targetDataLocationSegments: string[] = targetDataLocation.split(".");
    const sourceDataLocationIndex: number = parseInt(
        sourceDataLocationSegments[sourceDataLocationSegments.length - 1],
        10
    );
    const targetDataLocationIndex: number = parseInt(
        targetDataLocationSegments[targetDataLocationSegments.length - 1],
        10
    );
    const parentTargetDataLocation: string = targetDataLocationSegments
        .slice(0, -1)
        .join(".");
    const targetParentData: unknown[] = get(data, parentTargetDataLocation);

    switch (direction) {
        case VerticalDragDirection.center:
            setDataOnDropVerticalCenter(
                data,
                targetData,
                sourceData,
                targetDataLocation,
                type
            );

            (targetParentData as any[]).splice(sourceDataLocationIndex, 1);

            break;
        case VerticalDragDirection.up:
            if (targetNestedBelowSource) {
                (targetParentData as any[]).splice(
                    targetDataLocationIndex,
                    0,
                    sourceData
                );
                (targetParentData as any[]).splice(sourceDataLocationIndex, 1);
            } else {
                (targetParentData as any[]).splice(sourceDataLocationIndex, 1);
                (targetParentData as any[]).splice(
                    targetDataLocationIndex,
                    0,
                    sourceData
                );
            }
            break;
        default:
            if (targetNestedBelowSource) {
                (targetParentData as any[]).splice(
                    targetDataLocationIndex + 1,
                    0,
                    sourceData
                );
                (targetParentData as any[]).splice(sourceDataLocationIndex, 1);
            } else {
                (targetParentData as any[]).splice(sourceDataLocationIndex, 1);
                (targetParentData as any[]).splice(
                    targetDataLocationIndex + 1,
                    0,
                    sourceData
                );
            }
    }
}

function setDataWhenTargetInArrayAndSourceInArray(
    data: unknown,
    sourceDataLocation: string,
    targetDataLocation: string,
    direction: VerticalDragDirection,
    targetNestedBelowSource: boolean,
    type: NavigationDataType
): void {
    const sourceData: unknown = get(data as object, sourceDataLocation);
    const targetData: unknown = get(data as object, targetDataLocation);
    const sourceDataLocationSegments: string[] = sourceDataLocation.split(".");
    const targetDataLocationSegments: string[] = targetDataLocation.split(".");
    const sourceDataLocationIndex: number = parseInt(
        sourceDataLocationSegments[sourceDataLocationSegments.length - 1],
        10
    );
    const targetDataLocationIndex: number = parseInt(
        targetDataLocationSegments[targetDataLocationSegments.length - 1],
        10
    );
    const parentTargetDataLocation: string = targetDataLocationSegments
        .slice(0, -1)
        .join(".");
    const parentSourceDataLocation: string = sourceDataLocationSegments
        .slice(0, -1)
        .join(".");
    const parentSourceData: unknown | unknown[] = get(data, parentSourceDataLocation);
    const parentTargetData: unknown[] = get(data, parentTargetDataLocation);

    if (!targetNestedBelowSource) {
        (parentSourceData as unknown[]).splice(sourceDataLocationIndex, 1);

        if ((parentSourceData as unknown[]).length === 1) {
            set(
                data as object,
                parentSourceDataLocation,
                (parentSourceData as object[])[0]
            );
        }
    }

    switch (direction) {
        case VerticalDragDirection.center:
            setDataOnDropVerticalCenter(
                data,
                targetData,
                sourceData,
                targetDataLocation,
                type
            );
            break;
        case VerticalDragDirection.up:
            parentTargetData.splice(targetDataLocationIndex, 0, sourceData);
            break;
        default:
            parentTargetData.splice(targetDataLocationIndex + 1, 0, sourceData);
    }

    if (targetNestedBelowSource) {
        (parentSourceData as unknown[]).splice(sourceDataLocationIndex, 1);

        if ((parentSourceData as unknown[]).length === 1) {
            set(
                data as object,
                parentSourceDataLocation,
                (parentSourceData as object[])[0]
            );
        }
    }
}

function setDataWhenTargetInObjectAndSourceInObject(
    data: unknown,
    sourceDataLocation: string,
    targetDataLocation: string,
    direction: VerticalDragDirection,
    targetNestedBelowSource: boolean,
    type: NavigationDataType
): void {
    const sourceData: unknown = get(data, sourceDataLocation);
    const targetData: unknown[] = get(data, targetDataLocation);

    if (!targetNestedBelowSource) {
        unset(data, sourceDataLocation);
    }

    switch (direction) {
        case VerticalDragDirection.center:
            setDataOnDropVerticalCenter(
                data,
                targetData,
                sourceData,
                targetDataLocation,
                type
            );
            break;
        case VerticalDragDirection.up:
            set(data as object, targetDataLocation, [sourceData, targetData]);
            break;
        default:
            set(data as object, targetDataLocation, [targetData, sourceData]);
    }

    if (targetNestedBelowSource) {
        unset(data, sourceDataLocation);
    }
}

function setDataWhenTargetInArray(
    data: unknown,
    sourceDataLocation: string,
    targetDataLocation: string,
    direction: VerticalDragDirection,
    targetNestedBelowSource: boolean,
    type: NavigationDataType
): void {
    const sourceData: unknown = get(data, sourceDataLocation);
    const targetData: unknown = get(data, targetDataLocation);
    const targetDataLocationSegments: string[] = targetDataLocation.split(".");
    const parentTargetDataLocation: string = targetDataLocationSegments
        .slice(0, -1)
        .join(".");
    const targetParentData: unknown[] = get(data, parentTargetDataLocation);

    if (!targetNestedBelowSource) {
        unset(data as object, sourceDataLocation);
    }

    switch (direction) {
        case VerticalDragDirection.center:
            setDataOnDropVerticalCenter(
                data,
                targetData,
                sourceData,
                targetDataLocation,
                type
            );
            break;
        case VerticalDragDirection.up:
            targetParentData.splice(
                parseInt(
                    targetDataLocationSegments[targetDataLocationSegments.length - 1],
                    10
                ),
                0,
                sourceData
            );
            break;
        default:
            targetParentData.splice(
                parseInt(
                    targetDataLocationSegments[targetDataLocationSegments.length - 1],
                    10
                ) + 1,
                0,
                sourceData
            );
    }

    if (targetNestedBelowSource) {
        unset(data as object, sourceDataLocation);
    }
}

function setDataWhenSourceInArray(
    data: unknown,
    sourceDataLocation: string,
    targetDataLocation: string,
    direction: VerticalDragDirection,
    targetNestedBelowSource: boolean,
    type: NavigationDataType
): void {
    const sourceData: unknown = get(data, sourceDataLocation);
    const targetData: unknown = get(data, targetDataLocation);
    const sourceDataLocationSegments: string[] = sourceDataLocation.split(".");
    const lastSourceDataLocationIndex: number = parseInt(
        sourceDataLocationSegments[sourceDataLocationSegments.length - 1],
        10
    );
    const parentSourceDataLocation: string = sourceDataLocationSegments
        .slice(0, -1)
        .join(".");
    const parentSourceData: unknown | unknown[] = get(data, parentSourceDataLocation);

    if (!targetNestedBelowSource) {
        (parentSourceData as unknown[]).splice(lastSourceDataLocationIndex, 1);

        if ((parentSourceData as unknown[]).length === 1) {
            set(
                data as object,
                parentSourceDataLocation,
                (parentSourceData as object[])[0]
            );
        }
    }

    switch (direction) {
        case VerticalDragDirection.center:
            setDataOnDropVerticalCenter(
                data,
                targetData,
                sourceData,
                targetDataLocation,
                type
            );
            break;
        case VerticalDragDirection.up:
            set(data as object, targetDataLocation, [sourceData].concat(targetData));
            break;
        default:
            set(data as object, targetDataLocation, [targetData].concat(sourceData));
    }

    if (targetNestedBelowSource) {
        (parentSourceData as unknown[]).splice(lastSourceDataLocationIndex, 1);

        if ((parentSourceData as unknown[]).length === 1) {
            set(
                data as object,
                parentSourceDataLocation,
                (parentSourceData as object[])[0]
            );
        }
    }
}

function setDataWhenTargetIsUndefined(
    data: unknown,
    sourceDataLocation: string,
    targetDataLocation: string
): void {
    const sourceData: unknown = get(data, sourceDataLocation);

    unset(data, sourceDataLocation);
    set(data as object, targetDataLocation, sourceData);
}
