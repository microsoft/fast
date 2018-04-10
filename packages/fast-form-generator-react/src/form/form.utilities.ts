import { clone, cloneDeep, get, isEqual, mergeWith } from "lodash-es";
import { IComponentItem, IFormState, LocationOnChange } from "./form.props";
import { updateActiveSection } from "./form-section.props";

/**
 * Gets the data cache based on a new data object and
 * previous data object
 */
export function getDataCache(dataCache: any, newData: any): any {
    let newDataCache: any = (typeof dataCache !== "undefined") ? cloneDeep(dataCache) : newData;

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

export interface IBreadcrumbItem {
    href: string;
    text: string;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Gets the breadcrumb props
 */
export function getBreadcrumbItems(
    activeSchemaLocation: string,
    activeDataLocation: string,
    schema: any,
    onUpdateActiveSection: updateActiveSection,
    onUpdateLocation?: LocationOnChange
): IBreadcrumbItem[] {
    const breadcrumbItems: IBreadcrumbItem[] = [];
    const untitled: string = "Untitled";
    const oneOfAnyOfRegex: RegExp = /(oneOf|anyOf)\[\d+\]/g;
    const schemaLocationItems: string[] = activeSchemaLocation.split(".");
    const dataLocationItems: string[] = activeDataLocation.split(".");
    let schemaLocation: string = "";
    let dataLocation: string = "";
    let dataLocationCount: number = 0;

    for (let i: number = 0, locationLength: number = schemaLocationItems.length; i < locationLength; i++) {
        schemaLocation = schemaLocation === ""
            ? schemaLocationItems[i]
            : `${schemaLocation}.${schemaLocationItems[i]}`;
        let subSchema: any = schemaLocation === ""
            ? schema
            : get(schema, schemaLocation);

        const isProperties: boolean = schemaLocationItems[i] === "properties";
        const isOneOfAnyOf: boolean = schemaLocationItems[i].match(oneOfAnyOfRegex) !== null;
        const hasProperties: boolean = typeof subSchema !== "undefined"
            && typeof subSchema.properties !== "undefined"
            && typeof subSchema.properties === "object";
        const hasOneOfAnyOf: boolean = typeof subSchema !== "undefined"
            && (typeof subSchema.anyOf !== "undefined" || typeof subSchema.oneOf !== "undefined");

        if (
            (typeof subSchema === "undefined" && !isProperties && !isOneOfAnyOf) ||
            (typeof subSchema !== "undefined" && !isOneOfAnyOf && (subSchema.type === "object" || hasProperties || hasOneOfAnyOf))
        ) {
            // if a subSchema is undefined, it is an array, we can use the
            // schema supplied directly
            if (
                typeof subSchema === "undefined"
                && schemaLocationItems[i] !== "properties"
            ) {
                subSchema = schema;
            }

            dataLocation += dataLocationItems[dataLocationCount];
            dataLocationCount++;
            const clonedSchemaLocation: string = clone(schemaLocation);
            const clonedSchema: any = clone(schema);
            const clonedActiveDataLocation: string = clone(activeDataLocation);

            breadcrumbItems.push({
                href: "#",
                text: subSchema && subSchema.title ? subSchema.title : untitled,
                onClick: (e: React.MouseEvent<HTMLElement>): void => {
                    e.preventDefault();

                    if (onUpdateLocation) {
                        onUpdateLocation(
                            clonedSchemaLocation,
                            clonedActiveDataLocation
                        );
                    } else {
                        onUpdateActiveSection(
                            clonedSchemaLocation,
                            clonedActiveDataLocation,
                            clonedSchema
                        );
                    }
                }
            });
        }
    }

    return breadcrumbItems;
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
): Partial<IFormState> {
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
 * Get the component tracker and update it if necessary
 */
export function getComponentTracker(
    schemaLocation: string,
    dataLocation: string,
    schema: any,
    componentTracker: IComponentItem[]
): IComponentItem[] {
    let updatedComponentTracker: IComponentItem[] = [];

    // check the component tracker against the schema provided
    let isTracked: boolean = false;
    let lastTracked: number;

    componentTracker.forEach((component: any, index: number): void => {
        if (
            (JSON.stringify(component.schema) === JSON.stringify(schema)) &&
            schemaLocation === component.schemaLocation
            && dataLocation === component.dataLocation
        ) {
            isTracked = true;
            lastTracked = index;
        }
    });

    // if there is no match add the new schema to the component tracker
    if (!isTracked) {
        updatedComponentTracker = updatedComponentTracker.concat(componentTracker);
        updatedComponentTracker.push({
            dataLocation,
            schemaLocation,
            schema
        });
    // if there is a containing item
    } else {
        updatedComponentTracker = updatedComponentTracker.concat(componentTracker);
        updatedComponentTracker.splice(lastTracked + 1);
    }

    return updatedComponentTracker;
}

/**
 * Check to see if we are on the root location
 */
export function isRootLocation(location: string): boolean {
    return location === "";
}
