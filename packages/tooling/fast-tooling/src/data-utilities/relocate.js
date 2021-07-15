/**
 * This functionality deals with the relocation of pieces of data
 * using data locations (lodash path syntax).
 */
import { cloneDeep, get, set, unset } from "lodash-es";
import { normalizeDataLocationToDotNotation } from "./location";
import { DataType } from "./types";
/**
 * Gets the parent location of an item, used primarily for arrays where the index or last item
 * is important for manipulating the array
 */
function getParentDataLocation(dataLocation, arrayIndexCallback) {
    const dataLocationAsDotNotation = normalizeDataLocationToDotNotation(dataLocation);
    const dataLocationSegments = dataLocationAsDotNotation.split(".");
    arrayIndexCallback(
        parseInt(dataLocationSegments[dataLocationSegments.length - 1], 10)
    );
    return dataLocationSegments.slice(0, dataLocationSegments.length - 1).join(".");
}
/**
 * Gets updated array data with source data
 */
function getArrayDataUpdatedWithSourceData(config) {
    let targetIndex;
    const dataLocationOfArray = getParentDataLocation(
        config.targetDataLocation,
        index => {
            targetIndex = index;
        }
    );
    const dataLocationIsRoot = dataLocationOfArray === "";
    let newTargetArray = dataLocationIsRoot
        ? config.data
        : get(config.data, dataLocationOfArray);
    if (newTargetArray === undefined) {
        newTargetArray = [config.sourceData];
    } else {
        newTargetArray.splice(targetIndex, 0, config.sourceData);
    }
    if (dataLocationIsRoot) {
        return newTargetArray;
    }
    set(config.data, dataLocationOfArray, newTargetArray);
    return config.data;
}
/**
 * Get updated data that is not in an array
 */
function getNonArrayDataUpdatedWithSourceData(config) {
    set(config.data, config.targetDataLocation, config.sourceData);
    return config.data;
}
/**
 * Gets updated data with new source data
 */
export function getDataUpdatedWithSourceData(config) {
    const clonedData = cloneDeep(config.data);
    if (config.targetDataType === DataType.array) {
        return getArrayDataUpdatedWithSourceData(
            Object.assign(Object.assign({}, config), { data: clonedData })
        );
    }
    return getNonArrayDataUpdatedWithSourceData(config);
}
/**
 * Gets information needed for removing items from an object
 */
function getItemObjectConfig(dataLocation) {
    return {
        dataLocationOfObject: dataLocation,
        isArray: false,
    };
}
/**
 * Gets information needed for removing array items
 */
function getItemArrayConfig(dataLocation, index) {
    return {
        dataLocationOfArray: dataLocation,
        isArray: true,
        index,
    };
}
/**
 * Determines if the parent of a location is an array
 */
function isParentAnArray(parentDataLocation, data, lastSegmentAsNumber) {
    return isNaN(lastSegmentAsNumber) && parentDataLocation === ""
        ? Array.isArray(data)
        : Array.isArray(get(data, parentDataLocation));
}
/**
 * Determines if the target is in an array
 */
function isTargetInArray(dataLocation, data) {
    let arrayIndex;
    const parentDataLocation = getParentDataLocation(dataLocation, index => {
        arrayIndex = index;
    });
    if (!isParentAnArray(parentDataLocation, data, arrayIndex)) {
        return getItemObjectConfig(dataLocation);
    }
    return getItemArrayConfig(parentDataLocation, arrayIndex);
}
/**
 * Gets the updated data without source data
 */
export function getDataUpdatedWithoutSourceData(config) {
    const clonedData = cloneDeep(config.data);
    const sourceDataConfig = isTargetInArray(config.sourceDataLocation, config.data);
    if (!sourceDataConfig.isArray) {
        unset(clonedData, config.sourceDataLocation);
    } else {
        const newTargetArray = get(clonedData, sourceDataConfig.dataLocationOfArray);
        newTargetArray.splice(sourceDataConfig.index, 1);
        set(clonedData, sourceDataConfig.dataLocationOfArray, newTargetArray);
    }
    return clonedData;
}
