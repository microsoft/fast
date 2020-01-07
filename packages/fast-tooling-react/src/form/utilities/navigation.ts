import { cloneDeep, get, memoize } from "lodash-es";
import {
    getDataLocationsOfChildren,
    getPartialData,
    mapSchemaLocationFromDataLocation,
    normalizeDataLocation,
} from "../../data-utilities/location";
import { FormChildOptionItem } from "../form.props";
import { getReactDefaultChildren, propsKeyword } from "./form";
import { reactChildrenStringSchema } from "../controls/control.children.text";

export interface NavigationItemConfig {
    dataLocation: string;
    schemaLocation: string;
    schema: unknown;
    data: unknown;
    default: unknown;
}

export interface NavigationItem {
    /**
     * A string using lodash path syntax for the path where this data is located
     */
    dataLocation: string;

    /**
     * A string using lodash path syntax for the path where this schema is located
     */
    schemaLocation: string;

    /**
     * The data
     */
    data: unknown;

    /**
     * The schema or schema partial
     */
    schema: unknown;

    /**
     * The default data if default data exists
     */
    default: unknown;

    /**
     * The title
     */
    title: string;
}

export interface NavigationMap {
    [key: string]: NavigationItem;
}

export interface Component {
    dataLocation: string;
    schema: unknown;
}

export interface NavigationConfig {
    dataLocation: string;
    data: unknown | void;
    schema: unknown;
    childOptions: FormChildOptionItem[];
}

class Navigation {
    private navigationMap: NavigationMap;

    private config: NavigationConfig;

    private dataLocation: string;

    private reactChildrenDataLocations: string[];

    private resolveNormalizeDataLocation: ((dataLocation: string) => string);

    private resolveDataLocations: ((dataLocation: string) => string[]);

    constructor(config: NavigationConfig) {
        this.navigationMap = {};
        this.config = cloneDeep(config);
        this.config.childOptions = getReactDefaultChildren().concat(
            this.config.childOptions
        );
        this.resolveNormalizeDataLocation = memoize(this.normalizeDataLocation);
        this.resolveDataLocations = memoize(this.getDataLocationArray);
        this.updateChildrenLocations();
        this.dataLocation = this.resolveNormalizeDataLocation(config.dataLocation);

        this.setItemToNavigationMap(this.dataLocation);
    }

    /**
     * Update the location, if not already part of the mapping
     */
    public updateDataLocation(
        dataLocation: string,
        callback: (updatedNav: NavigationItem[]) => void
    ): void {
        this.updateChildrenLocations(); // children may have been added/removed
        this.dataLocation = this.resolveNormalizeDataLocation(dataLocation);

        if (
            typeof get(this.navigationMap[dataLocation], "schemaLocation") === "undefined"
        ) {
            this.setItemToNavigationMap(this.dataLocation);
        }

        callback(this.get());
    }

    /**
     * Update data at the current data location
     */
    public updateData = (
        data: unknown,
        callback: (updatedNav: NavigationItem[]) => void
    ): void => {
        this.config.data = cloneDeep(data);
        this.updateChildrenLocations(); // children may have been added/removed

        Object.keys(this.navigationMap).forEach((navigationMapKey: string) => {
            if (typeof this.navigationMap[navigationMapKey].data !== "undefined") {
                if (navigationMapKey === "") {
                    this.navigationMap[""].data = this.config.data;
                } else {
                    this.navigationMap[navigationMapKey].data = get(
                        this.config.data,
                        this.navigationMap[navigationMapKey].dataLocation
                    );
                }
            }
        });

        callback(this.get());
    };

    /**
     * Gets an array of navigation items
     */
    public get(): NavigationItem[] {
        return this.resolveDataLocations(this.dataLocation)
            .map(
                (dataLocation: string): NavigationItem => {
                    const normalizedDataLocation: string = normalizeDataLocation(
                        dataLocation,
                        this.config.data,
                        this.config.schema
                    );
                    // return a previously resolved navigation item
                    if (
                        typeof this.navigationMap[normalizedDataLocation] === "undefined"
                    ) {
                        this.setItemToNavigationMap(normalizedDataLocation);
                    }

                    return this.navigationMap[normalizedDataLocation];
                }
            )
            .map(this.updateDefaultValues);
    }

    private updateChildrenLocations(): void {
        this.reactChildrenDataLocations = getDataLocationsOfChildren(
            this.config.schema,
            this.config.data,
            this.config.childOptions
        );
    }

    private getDataLocationArray(dataLocation: string): string[] {
        const dataLocations: Set<string> = this.getDataLocations(dataLocation);
        const dataLocationIterator: IterableIterator<string> = dataLocations.values();
        const dataLocationsArray: string[] = [];

        // convert the set into of data locations into an array
        for (let i: number = 0, size: number = dataLocations.size; i !== size; i++) {
            dataLocationsArray.push(dataLocationIterator.next().value);
        }

        return dataLocationsArray.filter(
            (dataLocationInArray: string): boolean => {
                return (
                    typeof get(this.config.data, dataLocationInArray) === "string" ||
                    !this.reactChildrenDataLocations.includes(dataLocationInArray)
                );
            }
        );
    }

    /**
     * Normalize the data location to use bracket notation for arrays
     */
    private normalizeDataLocation(dataLocation: string): string {
        const normalizedDataLocation: string = normalizeDataLocation(
            dataLocation,
            this.config.data,
            this.config.schema
        );

        return !this.reactChildrenDataLocations.includes(normalizedDataLocation) ||
            typeof get(this.config.data, normalizedDataLocation) === "string"
            ? normalizedDataLocation
            : `${normalizedDataLocation}.${propsKeyword}`;
    }

    private getDataLocations(dataLocation: string): Set<string> {
        return new Set(
            [""].concat(this.getLocationsFromSegments(dataLocation.split(".")))
        );
    }

    /**
     * Gets locations from individual location segments
     * Example:
     * getLocationsFromSegments(["children[0].props.object"])
     * output: ["children[0]", "children[0].props", "children[0].props.object"]
     */
    private getLocationsFromSegments(segments: string[]): string[] {
        return segments.map((location: string, index: number) => {
            return segments.slice(0, index + 1).join(".");
        });
    }

    /**
     * Sets the navigation map for any undefined items
     */
    private setItemToNavigationMap(dataLocation: string): void {
        const normalizedDataLocation: string = normalizeDataLocation(
            dataLocation,
            this.config.data,
            this.config.schema
        );
        if (typeof this.navigationMap[normalizedDataLocation] === "undefined") {
            const data: unknown = getPartialData(dataLocation, this.config.data);
            const component: Component = this.getSchemaByDataLocation(
                this.config.schema,
                this.config.data,
                dataLocation,
                this.config.childOptions
            );
            const relativeSchemaLocation: string = this.getRelativeSchemaLocation(
                dataLocation,
                component
            );

            this.navigationMap[normalizedDataLocation] = {
                dataLocation: normalizedDataLocation,
                schemaLocation: relativeSchemaLocation,
                title: get(
                    component.schema,
                    `${relativeSchemaLocation}${
                        relativeSchemaLocation === "" ? "" : "."
                    }title`,
                    "Untitled"
                ),
                schema: component.schema,
                data,
                default: void 0, // this must be resolved as an update after the rest of the navigation has been determined
            };
        }
    }

    private getRelativeSchemaLocation(
        dataLocation: string,
        component: Component
    ): string {
        let relativeComponentDataLocation: string =
            component.dataLocation === ""
                ? dataLocation
                : dataLocation.slice(component.dataLocation.length);

        if (relativeComponentDataLocation.charAt(0) === ".") {
            // trim off "." in case this is a location nested inside a component
            relativeComponentDataLocation = relativeComponentDataLocation.slice(1);
        }

        if (component.schema === reactChildrenStringSchema) {
            relativeComponentDataLocation = "";
        }

        return mapSchemaLocationFromDataLocation(
            relativeComponentDataLocation,
            component.schema,
            component.dataLocation === ""
                ? this.config.data
                : get(this.config.data, component.dataLocation)
        );
    }

    private getSchemaByDataLocation(
        currentSchema: unknown,
        data: unknown,
        dataLocation: string,
        childOptions: FormChildOptionItem[]
    ): Component {
        if (dataLocation === "") {
            return { schema: currentSchema, dataLocation: "" };
        }

        const childrenDataLocation: string = this.reactChildrenDataLocations
            .reverse()
            .find(
                (reactChildrenDataLocation: string): boolean => {
                    // must be the longest item in the array that is still shorter than the given data location
                    return (
                        reactChildrenDataLocation.length <= dataLocation.length &&
                        dataLocation.slice(0, reactChildrenDataLocation.length) ===
                            reactChildrenDataLocation
                    );
                }
            );

        // Store a dataLocation of the closest component child
        const componentChildrenData: any = get(data, childrenDataLocation);
        // Store data directly from the given data location
        const stringChildrenData: any = get(data, dataLocation);
        // Get the ID of the component this belongs to, use the react children string schema
        // if this is a string use the internal react string children schema
        const id: string | undefined =
            typeof stringChildrenData === "string" &&
            dataLocation === childrenDataLocation
                ? reactChildrenStringSchema.id
                : get(componentChildrenData, "id")
                    ? componentChildrenData.id
                    : void 0;
        const childOptionWithMatchingSchemaId: FormChildOptionItem = childOptions.find(
            (childOption: FormChildOptionItem) => {
                return childOption.schema.id === id;
            }
        );

        return childOptionWithMatchingSchemaId
            ? {
                  schema: childOptionWithMatchingSchemaId.schema,
                  dataLocation: `${childrenDataLocation}${
                      id === reactChildrenStringSchema.id ? "" : `.${propsKeyword}`
                  }`,
              }
            : {
                  schema: currentSchema,
                  dataLocation: "",
              };
    }

    /**
     * A function to be run on navigation items to determine inherited
     * default values
     */
    private updateDefaultValues = (
        navigationItem: NavigationItem,
        index: number, // needed as part of map
        navigationItems: NavigationItem[]
    ): NavigationItem => {
        const navigationItemWithDefaultValue: NavigationItem = navigationItem;

        navigationItemWithDefaultValue.default = this.getDefaultValue(
            {
                schema: navigationItem.schema,
                dataLocation: "",
            },
            navigationItems
        );

        return navigationItemWithDefaultValue;
    };

    private getDefaultValue(
        component: Component,
        navigationItems: NavigationItem[]
    ): unknown {
        const navigationItemsLength: number = navigationItems.length - 1;

        for (let i: number = navigationItemsLength; i >= 0; i--) {
            const schemaLocation: string = this.getRelativeSchemaLocation(
                navigationItems[i].dataLocation,
                component
            );
            const defaultValue: unknown = get(
                component.schema,
                `${schemaLocation === "" ? "" : `${schemaLocation}.`}default`
            );

            if (typeof defaultValue !== "undefined") {
                if (i === navigationItemsLength) {
                    return defaultValue;
                }

                return get(
                    defaultValue,
                    navigationItems[navigationItemsLength].dataLocation
                );
            }
        }
    }
}

export default Navigation;
