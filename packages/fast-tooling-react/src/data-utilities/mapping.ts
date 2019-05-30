import React from "react";
import { cloneDeep, get, set, uniqueId } from "lodash-es";
import { Plugin, PluginProps } from "./plugin";
import {
    ChildOptionItem,
    DataResolverType,
    DataType,
    idKeyword,
    MappedDataLocation,
    pluginIdKeyword,
    PluginLocation,
    PluginResolverDataMap,
    PluginResolverDataMapConfig,
    propsKeyword,
} from "./types";
import {
    getChildOptionBySchemaId,
    getDataLocationsOfChildren,
    getDataLocationsOfPlugins,
    mapSchemaLocationFromDataLocation,
    pluginFindIndexCallback,
    squareBracketsRegex,
} from "./location";

/**
 * Maps data returned from the form generator to the React components
 */
export function mapDataToComponent(
    schema: any,
    data: any,
    childOptions: ChildOptionItem[] = [],
    plugins: Array<Plugin<PluginProps>> = []
): MappedDataLocation[] {
    const mappedData: any = cloneDeep(data);

    // find locations of all items of data that are react children
    let reactChildrenDataLocations: string[] = getDataLocationsOfChildren(
        schema,
        mappedData,
        childOptions
    );

    // find locations of all items of data that are overridden by mappings
    const pluginModifiedDataLocations: PluginLocation[] = getDataLocationsOfPlugins(
        schema,
        mappedData,
        childOptions
    );

    // remove any children data locations from plugin modified locations
    reactChildrenDataLocations = reactChildrenDataLocations.filter(
        (reactChildrenDataLocation: string): string | undefined => {
            if (
                pluginModifiedDataLocations.findIndex(
                    pluginFindIndexCallback(reactChildrenDataLocation)
                ) === -1
            ) {
                return reactChildrenDataLocation;
            }
        }
    );

    // merge the plugin modified data locations with the children option data locations and categorize them
    return reactChildrenDataLocations
        .map(
            (childDataLocation: string): MappedDataLocation => {
                return {
                    mappingType: DataResolverType.component,
                    dataLocation: childDataLocation,
                };
            }
        )
        .concat(pluginModifiedDataLocations)
        .sort(orderMappedDataByDataLocation)
        .reduce((mappedDataReduced: any, mappedDataLocation: MappedDataLocation): any => {
            return resolveData(
                mappedDataLocation,
                mappedDataReduced,
                plugins,
                childOptions
            );
        }, mappedData);
}

/**
 * Gets resolved children back from the plugin
 */
function getPluginResolvedChildren(
    pluginData: any,
    pluginResolver: Plugin<PluginProps>,
    childOptions: ChildOptionItem[]
): any {
    return pluginResolver.resolver(
        get(pluginData, propsKeyword),
        getChildOptionBySchemaId(pluginData.id, childOptions)
    );
}

/**
 * Get the resolved data from a plugin and the data location to map to
 */
function getPluginResolverDataMap(
    pluginResolverDataMapConfig: PluginResolverDataMapConfig
): PluginResolverDataMap[] {
    const pluginResolverMapping: PluginResolverDataMap[] = [];

    if (pluginResolverDataMapConfig.isReactChildren) {
        if (Array.isArray(pluginResolverDataMapConfig.pluginData)) {
            pluginResolverDataMapConfig.pluginData.forEach(
                (pluginDataItem: any, index: number): void => {
                    const pluginResolverMappingItem: PluginResolverDataMap = {
                        data: getPluginResolvedChildren(
                            pluginDataItem,
                            pluginResolverDataMapConfig.pluginResolver,
                            pluginResolverDataMapConfig.childOptions
                        ),
                        dataLocation: `${
                            pluginResolverDataMapConfig.dataLocation
                        }.${index}`,
                    };

                    pluginResolverMapping.push(pluginResolverMappingItem);
                }
            );
        } else {
            const pluginResolverMappingItem: PluginResolverDataMap = {
                data: getPluginResolvedChildren(
                    pluginResolverDataMapConfig.pluginData,
                    pluginResolverDataMapConfig.pluginResolver,
                    pluginResolverDataMapConfig.childOptions
                ),
                dataLocation: pluginResolverDataMapConfig.dataLocation,
            };

            pluginResolverMapping.push(pluginResolverMappingItem);
        }
    } else {
        const pluginResolverMappingItem: PluginResolverDataMap = {
            dataLocation: pluginResolverDataMapConfig.dataLocation,
            data: pluginResolverDataMapConfig.pluginResolver.resolver(
                pluginResolverDataMapConfig.pluginData
            ),
        };

        pluginResolverMapping.push(pluginResolverMappingItem);
    }

    return pluginResolverMapping;
}

function resolveData(
    mappedDataLocation: MappedDataLocation,
    data: any,
    plugins: Array<Plugin<PluginProps>>,
    childOptions: ChildOptionItem[]
): any {
    switch (mappedDataLocation.mappingType) {
        case DataResolverType.plugin:
            return mapPluginToData(
                mappedDataLocation as PluginLocation,
                data,
                plugins,
                childOptions
            );
        case DataResolverType.component:
        default:
            return mapDataToChildren(data, mappedDataLocation.dataLocation, childOptions);
    }
}

function mapPluginToData(
    pluginModifiedDataLocation: PluginLocation,
    data: any,
    plugins: Array<Plugin<PluginProps>>,
    childOptions: ChildOptionItem[]
): any {
    const mappedData: any = cloneDeep(data);
    const pluginModifiedSchemaLocation: string = mapSchemaLocationFromDataLocation(
        pluginModifiedDataLocation.relativeDataLocation.replace(squareBracketsRegex, ""),
        pluginModifiedDataLocation.schema,
        data
    );
    const pluginId: string = get(
        pluginModifiedDataLocation.schema,
        `${pluginModifiedSchemaLocation}.${pluginIdKeyword}`
    );
    const pluginResolver: Plugin<PluginProps> = plugins.find(
        (plugin: Plugin<PluginProps>): boolean => {
            return plugin.matches(pluginId);
        }
    );
    const pluginData: any = get(data, pluginModifiedDataLocation.dataLocation);

    if (pluginResolver !== undefined) {
        getPluginResolverDataMap({
            isReactChildren: pluginModifiedDataLocation.type === DataType.children,
            pluginData,
            pluginResolver,
            childOptions,
            dataLocation: pluginModifiedDataLocation.dataLocation,
        }).forEach(
            (pluginResolverMappingItem: PluginResolverDataMap): void => {
                set(
                    mappedData,
                    pluginResolverMappingItem.dataLocation,
                    pluginResolverMappingItem.data
                );
            }
        );
    }

    return mappedData;
}

function mapDataToChildren(
    data: any,
    reactChildrenDataLocation: string,
    childOptions: ChildOptionItem[]
): any {
    const mappedData: any = cloneDeep(data);
    const subSchemaId: string = get(
        mappedData,
        `${reactChildrenDataLocation}.${idKeyword}`
    );
    const subData: any = get(mappedData, reactChildrenDataLocation);
    const isChildString: boolean = typeof subData === "string";
    const subDataNormalized: any = isChildString ? subData : get(subData, propsKeyword);
    const childOption: ChildOptionItem = getChildOptionBySchemaId(
        subSchemaId,
        childOptions
    );

    if (!isChildString) {
        let value: any;

        if (typeof childOption === "undefined") {
            value = Object.assign(
                { id: subSchemaId },
                React.createElement(
                    React.Fragment,
                    { key: uniqueId(subSchemaId) },
                    subDataNormalized
                )
            );
        } else {
            value = Object.assign(
                { id: subSchemaId },
                React.createElement(childOption.component, {
                    key: uniqueId(subSchemaId),
                    ...subDataNormalized,
                })
            );
        }

        set(mappedData, reactChildrenDataLocation, value);
    }

    return mappedData;
}

/**
 * Used as a sort compare function
 * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
function orderMappedDataByDataLocation(
    firstMapping: MappedDataLocation,
    secondMapping: MappedDataLocation
): number {
    const firstLocationLength: number = firstMapping.dataLocation.split(".").length;
    const secondLocationLength: number = secondMapping.dataLocation.split(".").length;

    if (firstLocationLength > secondLocationLength) {
        return -1;
    } else if (firstLocationLength < secondLocationLength) {
        return 1;
    }

    return 0;
}

export interface CodePreviewChildOption {
    /**
     * The JSX tag name of the component
     */
    name: string;

    /**
     * The JSON schema of the component
     */
    schema: any;
}

export interface MapCodePreviewConfig {
    /**
     * The data for the code preview
     */
    data: any;

    /**
     * The component children options
     */
    childOptions: CodePreviewChildOption[];
}

export interface CodePreviewConfig {
    /**
     * The data for the code preview
     */
    data: any;
}

export interface ComponentCodePreviewConfig extends CodePreviewConfig {
    /**
     * The current tab indenting in spaces
     */
    tabIndent: string;
}

/**
 * Maps data to the code preview, a string that conforms to JSX syntax
 */
export function mapDataToCodePreview(codePreviewConfig: MapCodePreviewConfig): string {
    const codePreview: ComponentCodePreview = new ComponentCodePreview(codePreviewConfig);

    return codePreview.render();
}

/**
 * A class which creates a formatted code preview when initialized
 * and provides methods for retrieving that preview
 */
class ComponentCodePreview {
    /**
     * Tab spacing
     */
    private tabIndent: string = "    ";

    /**
     * The component variables, used for data too complex for
     * inline JSX attributes
     */
    private variables: string[];

    /**
     * The JSX element as a string
     */
    private jsx: string = "";

    /**
     * The available children component options
     */
    private childOptions: CodePreviewChildOption[];

    constructor(props: MapCodePreviewConfig) {
        this.variables = [];
        this.childOptions = props.childOptions;
        this.jsx = this.getComponentCodePreview({
            data: props.data,
            tabIndent: "",
        });
    }

    /**
     * Renders the code preview
     */
    public render = (): string => {
        return (
            this.variables.reduce(
                (variables: string, variable: string) => variables + variable,
                ""
            ) + this.jsx
        );
    };

    /**
     * Gets a components code preview
     */
    private getComponentCodePreview(
        codePreviewConfig: ComponentCodePreviewConfig
    ): string {
        const component: CodePreviewChildOption = this.getChildOptionById(
            get(codePreviewConfig, "data.id"),
            this.childOptions
        );
        const childrenLocations: string[] = getDataLocationsOfChildren(
            component.schema,
            get(codePreviewConfig, "data.props"),
            []
        );
        let componentJSX: string = `<${component.name}`;
        const componentProps: any = get(codePreviewConfig, "data.props");

        if (typeof componentProps === "undefined" || componentProps === {}) {
            // There are no props, this component is self closing
            return `${componentJSX} />`;
        } else if (typeof componentProps === "object") {
            let componentAttributes: string = "";
            let nestedChildren: string = "";
            let hasNestedChildren: boolean = false;

            Object.keys(componentProps).forEach(
                (componentPropKey: string): any => {
                    // Check to see if any prop keys are React children
                    if (
                        childrenLocations.find(
                            (childrenLocation: string) =>
                                childrenLocation.replace(/\[\d*\]/, "") ===
                                componentPropKey
                        )
                    ) {
                        // The property key contains the word "children", use a nesting pattern
                        if (componentPropKey.match(/children(\[\d*\])?/) !== null) {
                            nestedChildren = this.getChildren(
                                componentProps[componentPropKey],
                                codePreviewConfig.tabIndent
                            );

                            hasNestedChildren = true;
                            // The property key is not nested but should be used as an attribute
                        } else {
                            componentAttributes += this.getComponentAttribute(
                                componentPropKey,
                                componentProps[componentPropKey],
                                codePreviewConfig.tabIndent,
                                true
                            );
                        }
                    } else {
                        componentAttributes += this.getComponentAttribute(
                            componentPropKey,
                            componentProps[componentPropKey],
                            codePreviewConfig.tabIndent,
                            false
                        );
                    }
                }
            );

            // Add attributes to the component
            componentJSX +=
                componentAttributes !== ""
                    ? `\n${componentAttributes}`
                    : hasNestedChildren
                        ? ""
                        : " ";
            // Add nested children and the end tag (or self closing) to the component
            componentJSX += hasNestedChildren
                ? `${componentAttributes !== "" ? codePreviewConfig.tabIndent : ""}>\n${
                      this.tabIndent
                  }${codePreviewConfig.tabIndent}${nestedChildren}\n${
                      codePreviewConfig.tabIndent
                  }</${component.name}>`
                : `${codePreviewConfig.tabIndent}/>`;
        }

        return componentJSX;
    }

    /**
     * Gets children components or primitives
     */
    private getChildren(value: any, tabIndent: string): string {
        const componentPropValue: any = Array.isArray(value) ? value : [value];

        return componentPropValue.reduce(
            (accumulatedChildrenValue: any, childrenValue: any): any => {
                const childrenDataType: string = typeof childrenValue;

                if (
                    ["string", "number", "boolean", "undefined"].includes(
                        childrenDataType
                    )
                ) {
                    return accumulatedChildrenValue + childrenValue;
                }

                const component: CodePreviewChildOption = this.getChildOptionById(
                    get(value, "id"),
                    this.childOptions
                );

                if (component) {
                    return (
                        accumulatedChildrenValue +
                        this.getComponentCodePreview({
                            data: value,
                            tabIndent: tabIndent + this.tabIndent,
                        })
                    );
                }

                return accumulatedChildrenValue;
            },
            ""
        );
    }

    /**
     * Gets a components attribute to be applied to the JSX element.
     * These should be indented if they are simple data types
     * and assigned as variables if they are a complex data type such as object or array.
     *
     * Example 1 (string):
     *     a={"foo"}
     * Example 2 (number):
     *     b={42}
     * Example 3 (object):
     *     c={foo}
     */
    private getComponentAttribute(
        propKey: string,
        propValue: any,
        tabIndent: string,
        children: boolean
    ): string {
        const propType: string = typeof propValue;
        const id: string = uniqueId(propKey);

        if (children) {
            this.variables.push(
                `const ${id} = (\n${this.tabIndent}${this.getChildren(
                    propValue,
                    ""
                )}\n);\n\n`
            );

            return `${this.tabIndent}${tabIndent}${propKey}={${id}}\n`;
        }

        switch (propType) {
            case "undefined":
            case "boolean":
            case "number":
                return `${this.tabIndent}${tabIndent}${propKey}={${propValue}}\n`;
            case "string":
                return `${this.tabIndent}${tabIndent}${propKey}={"${propValue}"}\n`;
            case "object":
            default:
                if (propValue === null) {
                    return `${this.tabIndent}${tabIndent}${propKey}={${propValue}}\n`;
                }

                this.variables.push(
                    `const ${id} = ${JSON.stringify(propValue, null, 2)};\n\n`
                );

                return `${this.tabIndent}${tabIndent}${propKey}={${id}}\n`;
        }
    }

    /**
     * Get the component by schema id
     */
    private getChildOptionById(
        id: string,
        childOptions: CodePreviewChildOption[]
    ): CodePreviewChildOption {
        return childOptions.find(
            (childOption: CodePreviewChildOption): boolean => {
                return get(childOption, "schema.id") === id;
            }
        );
    }
}
