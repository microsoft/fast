import { get } from "lodash-es";
import { normalizeDataLocationToDotNotation } from "./location";
/**
 * The target is in an array
 */
export function isInArray(data, dataLocation) {
    const dataLocationAsDotNotation = normalizeDataLocationToDotNotation(dataLocation);
    const dataLocationSegments = dataLocationAsDotNotation.split(".");
    const parentDataLocation = dataLocationSegments.slice(0, -1).join(".");
    return (
        !isNaN(parseInt(dataLocationSegments[dataLocationSegments.length - 1], 10)) &&
        Array.isArray(get(data, parentDataLocation))
    );
}
