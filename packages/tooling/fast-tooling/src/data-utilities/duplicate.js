import { cloneDeep, get, set } from "lodash-es";
import { normalizeDataLocationToDotNotation } from "./location";
import { isInArray } from "./array";
function duplicateDataInArray(data, sourceDataLocation) {
    const sourceData = get(data, sourceDataLocation);
    const sourceDataLocationSegments = sourceDataLocation.split(".");
    const parentSourceDataLocation = sourceDataLocationSegments.slice(0, -1).join(".");
    const parentSourceData = get(data, parentSourceDataLocation);
    let sourceDataLocationIndex = 0;
    sourceDataLocationIndex = parseInt(
        sourceDataLocationSegments[sourceDataLocationSegments.length - 1],
        10
    );
    parentSourceData.splice(sourceDataLocationIndex + 1, 0, cloneDeep(sourceData));
    set(data, parentSourceDataLocation, parentSourceData);
}
function duplicateData(data, sourceDataLocation) {
    const sourceData = get(data, sourceDataLocation);
    const targetData = [sourceData, sourceData];
    set(data, sourceDataLocation, targetData);
}
export function getDataWithDuplicate(sourceDataLocation, data) {
    const clonedData = cloneDeep(data);
    const normalizedSourceDataLocation = normalizeDataLocationToDotNotation(
        sourceDataLocation
    );
    if (isInArray(clonedData, normalizedSourceDataLocation)) {
        duplicateDataInArray(clonedData, normalizedSourceDataLocation);
    } else {
        duplicateData(clonedData, normalizedSourceDataLocation);
    }
    return clonedData;
}
