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
} from "./location";

/**
 * This file contains all functionality for mapping data
 */

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

/**
 * Maps data returned from the form generator to the React components
 */
function mapDataToComponent(
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
        pluginModifiedDataLocation.relativeDataLocation.replace(/(\[\d+\])/g, ""),
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

export { mapDataToComponent };
