/**
 * This functionality deals with the relocation of pieces of data
 * using data locations (lodash path syntax).
 */

import { cloneDeep, get, set, unset } from "lodash-es";
import { normalizeDataLocationToDotNotation } from "./location";
import { DataType } from "./types";

interface UpdateDataWithSourceConfig {
    targetDataLocation: string;
    targetDataType: DataType;
    sourceData: unknown;
    data: unknown;
}

interface UpdateDataWithoutSourceConfig {
    sourceDataLocation: string;
    data: unknown;
}

interface ItemArrayConfig {
    dataLocationOfArray: string;
    isArray: true;
    index: number;
}

interface ItemObjectConfig {
    dataLocationOfObject: string;
    isArray: false;
}

type RelocatedDataConfig = ItemArrayConfig | ItemObjectConfig;

/**
 * Gets the parent location of an item, used primarily for arrays where the index or last item
 * is important for manipulating the array
 */
function getParentDataLocation(
    dataLocation: string,
    arrayIndexCallback: (index: number) => void
): string {
    const dataLocationAsDotNotation: string = normalizeDataLocationToDotNotation(
        dataLocation
    );
    const dataLocationSegments: string[] = dataLocationAsDotNotation.split(".");

    arrayIndexCallback(
        parseInt(dataLocationSegments[dataLocationSegments.length - 1], 10)
    );

    return dataLocationSegments.slice(0, dataLocationSegments.length - 1).join(".");
}

/**
 * Gets updated array data with source data
 */
function getArrayDataUpdatedWithSourceData(config: UpdateDataWithSourceConfig): unknown {
    let targetIndex: number;
    const dataLocationOfArray: string = getParentDataLocation(
        config.targetDataLocation,
        (index: number): void => {
            targetIndex = index;
        }
    );
    const dataLocationIsRoot: boolean = dataLocationOfArray === "";
    let newTargetArray: unknown = dataLocationIsRoot
        ? config.data
        : get(config.data, dataLocationOfArray);

    if (newTargetArray === undefined) {
        newTargetArray = [config.sourceData];
    } else {
        (newTargetArray as unknown[]).splice(targetIndex, 0, config.sourceData);
    }

    if (dataLocationIsRoot) {
        return newTargetArray;
    }

    set(config.data as object, dataLocationOfArray, newTargetArray);

    return config.data;
}

/**
 * Get updated data that is not in an array
 */
function getNonArrayDataUpdatedWithSourceData<T>(
    config: UpdateDataWithSourceConfig
): unknown {
    set(config.data as object, config.targetDataLocation, config.sourceData);

    return config.data;
}

/**
 * Gets updated data with new source data
 */
export function getDataUpdatedWithSourceData(
    config: UpdateDataWithSourceConfig
): unknown {
    const clonedData: unknown = cloneDeep(config.data);

    if (config.targetDataType === DataType.array) {
        return getArrayDataUpdatedWithSourceData({
            ...config,
            data: clonedData,
        });
    }

    return getNonArrayDataUpdatedWithSourceData(config);
}

/**
 * Gets information needed for removing items from an object
 */
function getItemObjectConfig(dataLocation: string): ItemObjectConfig {
    return {
        dataLocationOfObject: dataLocation,
        isArray: false,
    };
}

/**
 * Gets information needed for removing array items
 */
function getItemArrayConfig(dataLocation: string, index: number): ItemArrayConfig {
    return {
        dataLocationOfArray: dataLocation,
        isArray: true,
        index,
    };
}

/**
 * Determines if the parent of a location is an array
 */
function isParentAnArray(
    parentDataLocation: string,
    data: unknown,
    lastSegmentAsNumber: number
): boolean {
    return isNaN(lastSegmentAsNumber) && parentDataLocation === ""
        ? Array.isArray(data)
        : Array.isArray(get(data, parentDataLocation));
}

/**
 * Determines if the target is in an array
 */
function isTargetInArray(dataLocation: string, data: unknown): RelocatedDataConfig {
    let arrayIndex: number;
    const parentDataLocation: string = getParentDataLocation(
        dataLocation,
        (index: number) => {
            arrayIndex = index;
        }
    );

    if (!isParentAnArray(parentDataLocation, data, arrayIndex)) {
        return getItemObjectConfig(dataLocation);
    }

    return getItemArrayConfig(parentDataLocation, arrayIndex);
}

/**
 * Gets the updated data without source data
 */
export function getDataUpdatedWithoutSourceData(
    config: UpdateDataWithoutSourceConfig
): unknown {
    const clonedData: unknown = cloneDeep(config.data);
    const sourceDataConfig: RelocatedDataConfig = isTargetInArray(
        config.sourceDataLocation,
        config.data
    );

    if (!sourceDataConfig.isArray) {
        unset(clonedData, config.sourceDataLocation);
    } else {
        const newTargetArray: unknown = get(
            clonedData,
            sourceDataConfig.dataLocationOfArray
        );

        (newTargetArray as unknown[]).splice(sourceDataConfig.index, 1);
        set(clonedData as object, sourceDataConfig.dataLocationOfArray, newTargetArray);
    }

    return clonedData;
}
