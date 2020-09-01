import React, { ComponentClass, FunctionComponent } from "react";
import {
    dictionaryLink,
    MapperConfig,
    pluginIdKeyword,
    PropertyKeyword,
    ResolverConfig,
} from "@microsoft/fast-tooling";

export interface ReactMapDataDictionaryPlugin {
    /**
     * The ids that map to the pluginIdKeyword in the JSON schema
     */
    ids: string[];

    /**
     * The mapping function that returns the mapped values
     */
    mapper: (data: any) => any;

    /**
     * The resolving function that returns the mapped values
     */
    resolver: (data: any) => any;
}

export interface ComponentDictionary {
    [key: string]: FunctionComponent<any> | ComponentClass<any> | string;
}

function getPluginResolver(
    plugins: ReactMapDataDictionaryPlugin[],
    id?: string
): ReactMapDataDictionaryPlugin | false {
    if (typeof id !== "string") {
        return false;
    }

    return plugins.find((plugin: ReactMapDataDictionaryPlugin) => {
        return plugin.ids.includes(id);
    });
}

function resolvePropertyWithPlugin(
    plugin: ReactMapDataDictionaryPlugin,
    value: any
): any {
    return plugin.resolver(value);
}

function mapPropertyWithPlugin(plugin: ReactMapDataDictionaryPlugin, value: any): any {
    return plugin.mapper(value);
}

/**
 * A mapping function intended to be used with the
 * `mapDataDictionary` export from the @microsoft/fast-tooling library
 */
export function reactMapper(
    componentDictionary: ComponentDictionary
): (config: MapperConfig<JSX.Element>) => void {
    return (config: MapperConfig<JSX.Element>): void => {
        if (typeof config.dataDictionary[0][config.dictionaryId].data === "string") {
            return;
        }

        const allAvailableProps = Object.keys(config.schema[PropertyKeyword.properties]);

        config.dataDictionary[0][config.dictionaryId].data = {
            component: componentDictionary[config.schema.id],
            props: allAvailableProps
                .filter(potentialProp => {
                    // remove slots from the attributes list
                    return !allAvailableProps
                        .filter((propName: string) => {
                            if (
                                config.schema[PropertyKeyword.properties][propName][
                                    dictionaryLink
                                ]
                            ) {
                                return propName;
                            }
                        })
                        .includes(potentialProp);
                })
                .reduce((previousValue: {}, currentValue: string) => {
                    const plugin = getPluginResolver(
                        config.mapperPlugins,
                        config.schema[PropertyKeyword.properties][currentValue][
                            pluginIdKeyword
                        ]
                    );

                    return {
                        ...previousValue,
                        [currentValue]: plugin
                            ? mapPropertyWithPlugin(
                                  plugin,
                                  config.dataDictionary[0][config.dictionaryId].data[
                                      currentValue
                                  ]
                              )
                            : config.dataDictionary[0][config.dictionaryId].data[
                                  currentValue
                              ],
                    };
                }, {}),
        };
    };
}

/**
 * A resolver function intended to be used with the
 * `mapDataDictionary` export from the @microsoft/fast-tooling library
 */
export function reactResolver(config: ResolverConfig<unknown>): any {
    if (config.dataDictionary[1] !== config.dictionaryId) {
        // the original data in the children location
        const childrenAtLocation =
            config.dataDictionary[0][
                config.dataDictionary[0][config.dictionaryId].parent.id
            ].data.props[
                config.dataDictionary[0][config.dictionaryId].parent.dataLocation
            ];
        const childrenProps: any = {
            ...config.dataDictionary[0][config.dictionaryId].data.props,
            key: Array.isArray(childrenAtLocation) ? childrenAtLocation.length : 0,
        };
        const pluginId: string =
            config.schemaDictionary[
                config.dataDictionary[0][
                    config.dataDictionary[0][config.dictionaryId].parent.id
                ].schemaId
            ][PropertyKeyword.properties][
                config.dataDictionary[0][config.dictionaryId].parent.dataLocation
            ][pluginIdKeyword];
        const plugin = getPluginResolver(config.resolverPlugins, pluginId);

        // the child item being resolved to a react component
        const newChildrenAtLocation = plugin
            ? resolvePropertyWithPlugin(plugin, childrenProps)
            : typeof config.dataDictionary[0][config.dictionaryId].data === "string"
            ? config.dataDictionary[0][config.dictionaryId].data
            : React.createElement(
                  config.dataDictionary[0][config.dictionaryId].data.component,
                  childrenProps
              );

        // re-assign this prop with the new child item
        config.dataDictionary[0][
            config.dataDictionary[0][config.dictionaryId].parent.id
        ].data.props[config.dataDictionary[0][config.dictionaryId].parent.dataLocation] =
            childrenAtLocation === undefined
                ? [newChildrenAtLocation]
                : [newChildrenAtLocation, ...childrenAtLocation];
    }

    if (typeof config.dataDictionary[0][config.dictionaryId].data === "string") {
        return config.dataDictionary[0][config.dictionaryId].data;
    }

    return React.createElement(
        config.dataDictionary[0][config.dictionaryId].data.component,
        config.dataDictionary[0][config.dictionaryId].data.props
    );
}
