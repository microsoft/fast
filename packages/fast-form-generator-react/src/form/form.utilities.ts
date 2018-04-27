import { clone, cloneDeep, get, isEqual, mergeWith } from "lodash-es";
import { IBreadcrumbItemConfig, IBreadcrumbItemsConfig, IComponentItem, IFormProps, IFormState, LocationOnChange } from "./form.props";

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
 * Gets the schema location as a string which can be used as a lodash get location
 */
function getSchemaLocation(schemaLocation: string, schemaLocationItem: string): string {
    return schemaLocation === "" ? schemaLocationItem : `${schemaLocation}.${schemaLocationItem}`;
}

/**
 * Determine if the properties object is present on the given schema
 */
function checkHasProperties(schema: any): boolean {
    return typeof schema !== "undefined" && typeof schema.properties === "object";
}

/**
 * Determine if a oneOf or anyOf options array is present on the given schema
 */
function checkHasOneOfAnyOf(schema: any): boolean {
    return typeof schema !== "undefined" && (typeof schema.anyOf !== "undefined" || typeof schema.oneOf !== "undefined");
}

/**
 * Determine if the schema corresponds to an array location
 */
function checkIsArray(schema: any, isProperties: boolean, isOneOfAnyOf: boolean): boolean {
    return typeof schema === "undefined" && !isProperties && !isOneOfAnyOf;
}

/**
 * Determine if the there is a schema within the schema
 */
function checkHasSubSchema(schema: any, isOneOfAnyOf: boolean): boolean {
    const hasProperties: boolean = checkHasProperties(schema);
    const hasOneOfAnyOf: boolean = checkHasOneOfAnyOf(schema);
    return typeof schema !== "undefined" && !isOneOfAnyOf && (schema.type === "object" || hasProperties || hasOneOfAnyOf);
}

/**
 * Gets a breadcrumb item props
 */
function getBreadcrumbItem(itemConfig: IBreadcrumbItemConfig): IBreadcrumbItem {
    return {
        href: "#",
        text: itemConfig.subSchema && itemConfig.subSchema.title ? itemConfig.subSchema.title : itemConfig.untitled,
        onClick: (e: React.MouseEvent<HTMLElement>): void => {
            e.preventDefault();

            if (itemConfig.config.onUpdateLocation) {
                itemConfig.config.onUpdateLocation(
                    itemConfig.config.activeSchemaLocation,
                    itemConfig.config.activeDataLocation
                );
            } else {
                itemConfig.config.onUpdateActiveSection(
                    itemConfig.config.activeSchemaLocation,
                    itemConfig.config.activeDataLocation,
                    itemConfig.schema
                );
            }
        }
    };
}

/**
 * Checks to see if this is pointing to an array or contains a schema
 */
function isArrayOrHasSubSchema(schemaLocationItem: string, subSchema: any): boolean {
    const oneOfAnyOfRegex: RegExp = /(oneOf|anyOf)\[\d+\]/g;
    const isProperties: boolean = schemaLocationItem === "properties";
    const isOneOfAnyOf: boolean = schemaLocationItem.match(oneOfAnyOfRegex) !== null;
    const isArray: boolean = checkIsArray(subSchema, isProperties, isOneOfAnyOf);
    const hasSubSchema: boolean = checkHasSubSchema(subSchema, isOneOfAnyOf);

    return isArray || hasSubSchema;
}

function getSubSchema(schema: any, subSchema: any, schemaLocationItem: string): any {
    if (typeof subSchema === "undefined" && schemaLocationItem !== "properties") {
        return schema;
    }

    return subSchema;
}

/**
 * Gets the breadcrumb props
 */
export function getBreadcrumbItems(config: IBreadcrumbItemsConfig): IBreadcrumbItem[] {
    const breadcrumbItems: IBreadcrumbItem[] = [];
    const untitled: string = "Untitled";
    const schemaLocationItems: string[] = config.activeSchemaLocation.split(".");
    const dataLocationItems: string[] = config.activeDataLocation.split(".");
    let schemaLocation: string;
    let dataLocation: string = "";
    let dataLocationCount: number = 0;

    for (const schemaLocationItem of schemaLocationItems) {
        schemaLocation = getSchemaLocation(schemaLocation, schemaLocationItem);
        let subSchema: any = get(schemaLocation, config.schema);

        if (isArrayOrHasSubSchema(schemaLocationItem, subSchema)) {
            subSchema = getSubSchema(config.schema, subSchema, schemaLocationItem);
            dataLocation += dataLocationItems[dataLocationCount];
            dataLocationCount++;

            breadcrumbItems.push(getBreadcrumbItem({
                subSchema,
                schema: clone(config.schema),
                config,
                untitled,
                schemaLocation: clone(schemaLocation),
                activeDataLocation: clone(config.activeDataLocation)
            }));
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

export function getComponentTrackerByLocation(props: IFormProps, rootLocation: IComponentItem): IComponentItem[] {
    return typeof props.location !== "undefined" // Location has been passed
        ? getComponentTracker(props.location.schemaLocation, props.location.dataLocation, props.schema, [rootLocation])
        : [rootLocation];
}
