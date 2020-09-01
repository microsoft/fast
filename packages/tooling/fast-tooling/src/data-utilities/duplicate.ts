import { cloneDeep, get, set } from "lodash-es";
import { normalizeDataLocationToDotNotation } from "./location";
import { isInArray } from "./array";

function duplicateDataInArray(data: unknown, sourceDataLocation: string): void {
    const sourceData: unknown = get(data as object, sourceDataLocation);
    const sourceDataLocationSegments: string[] = sourceDataLocation.split(".");
    const parentSourceDataLocation: string = sourceDataLocationSegments
        .slice(0, -1)
        .join(".");
    const parentSourceData: unknown | unknown[] = get(data, parentSourceDataLocation);
    let sourceDataLocationIndex: number = 0;

    sourceDataLocationIndex = parseInt(
        sourceDataLocationSegments[sourceDataLocationSegments.length - 1],
        10
    );

    (parentSourceData as unknown[]).splice(
        sourceDataLocationIndex + 1,
        0,
        cloneDeep(sourceData)
    );

    set(data as object, parentSourceDataLocation, parentSourceData as object[]);
}

function duplicateData(data: unknown, sourceDataLocation: string): void {
    const sourceData: unknown = get(data as object, sourceDataLocation);
    const targetData: unknown[] = [sourceData, sourceData];

    set(data as object, sourceDataLocation, targetData);
}

export function getDataWithDuplicate<T>(sourceDataLocation: string, data: T): T {
    const clonedData: T = cloneDeep(data) as T;
    const normalizedSourceDataLocation: string = normalizeDataLocationToDotNotation(
        sourceDataLocation
    );

    if (isInArray(clonedData, normalizedSourceDataLocation)) {
        duplicateDataInArray(clonedData, normalizedSourceDataLocation);
    } else {
        duplicateData(clonedData, normalizedSourceDataLocation);
    }

    return clonedData;
}
