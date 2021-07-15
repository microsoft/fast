import React from "react";
import {
    dictionaryLink,
    pluginIdKeyword,
    PropertyKeyword,
} from "@microsoft/fast-tooling";
function getPluginResolver(plugins, id) {
    if (typeof id !== "string") {
        return false;
    }
    return plugins.find(plugin => {
        return plugin.ids.includes(id);
    });
}
function resolvePropertyWithPlugin(plugin, value) {
    return plugin.resolver(value);
}
function mapPropertyWithPlugin(plugin, value) {
    return plugin.mapper(value);
}
/**
 * A mapping function intended to be used with the
 * `mapDataDictionary` export from the @microsoft/fast-tooling library
 */
export function reactMapper(componentDictionary) {
    return config => {
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
                        .filter(propName => {
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
                .reduce((previousValue, currentValue) => {
                    const plugin = getPluginResolver(
                        config.mapperPlugins,
                        config.schema[PropertyKeyword.properties][currentValue][
                            pluginIdKeyword
                        ]
                    );
                    return Object.assign(Object.assign({}, previousValue), {
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
                    });
                }, {}),
        };
    };
}
/**
 * A resolver function intended to be used with the
 * `mapDataDictionary` export from the @microsoft/fast-tooling library
 */
export function reactResolver(config) {
    if (config.dataDictionary[1] !== config.dictionaryId) {
        // the original data in the children location
        const childrenAtLocation =
            config.dataDictionary[0][
                config.dataDictionary[0][config.dictionaryId].parent.id
            ].data.props[
                config.dataDictionary[0][config.dictionaryId].parent.dataLocation
            ];
        const childrenProps = Object.assign(
            Object.assign({}, config.dataDictionary[0][config.dictionaryId].data.props),
            { key: Array.isArray(childrenAtLocation) ? childrenAtLocation.length : 0 }
        );
        const pluginId =
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
