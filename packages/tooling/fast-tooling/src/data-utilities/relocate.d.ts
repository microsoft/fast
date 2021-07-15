/**
 * This functionality deals with the relocation of pieces of data
 * using data locations (lodash path syntax).
 */
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
/**
 * Gets updated data with new source data
 */
export declare function getDataUpdatedWithSourceData(
    config: UpdateDataWithSourceConfig
): unknown;
/**
 * Gets the updated data without source data
 */
export declare function getDataUpdatedWithoutSourceData(
    config: UpdateDataWithoutSourceConfig
): unknown;
export {};
