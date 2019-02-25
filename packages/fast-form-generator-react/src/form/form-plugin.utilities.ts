import { getLocationsFromObject } from "@microsoft/fast-data-utilities-react";
import { cloneDeep, get, set, unset } from "lodash-es";
import { FormPlugin, FormPluginProps } from "../plugin";

const pluginIdKeyword: string = "formPluginId";

export interface FormPluginLocation {
    /**
     * The lodash path location of the schema partial
     * to be interpreted by the plugin
     */
    schemaLocation: string;
    /**
     * The schema related to the data location
     */
    schema: any;
}

interface FormPluginResolverSchemaMapConfig {
    /**
     * The partial schema to supply to the plugin
     */
    pluginSchema: any;

    /**
     * The data mapped to the full schema to supply to the plugin
     */
    pluginData: any;

    /**
     * The plugin to use to resolve the schema
     */
    pluginResolver: FormPlugin<FormPluginProps>;

    /**
     * The schema location
     */
    schemaLocation: string;
}

interface FormPluginResolverSchemaMap {
    /**
     * Data location for the resolved schema
     */
    schemaLocation: string;

    /**
     * Resolved schema
     */
    schema: any;
}

/**
 *
 */
export function mapPluginsToSchema(
    schema: any,
    data: any,
    plugins: Array<FormPlugin<FormPluginProps>> = []
): any {
    const mappedSchema: any = cloneDeep(schema);

    // identify locations of the plugins
    const pluginModifiedSchemaLocations: FormPluginLocation[] = getSchemaLocationsOfPlugins(
        schema
    );

    // going from the longest length to the shortest, resolve the data with plugins
    pluginModifiedSchemaLocations.forEach(
        (pluginModifiedSchemaLocation: FormPluginLocation): void => {
            const pluginId: string = get(
                pluginModifiedSchemaLocation.schema,
                `${pluginModifiedSchemaLocation.schemaLocation}.${pluginIdKeyword}`
            );
            const pluginResolver: FormPlugin<FormPluginProps> = plugins.find(
                (plugin: FormPlugin<FormPluginProps>): boolean => {
                    return plugin.matches(pluginId);
                }
            );
            const pluginSchema: any = get(
                schema,
                pluginModifiedSchemaLocation.schemaLocation
            );
            if (pluginResolver !== undefined) {
                const pluginResolverMapping: FormPluginResolverSchemaMap[] = getPluginResolverSchemaMap(
                    {
                        pluginSchema,
                        pluginData: data,
                        pluginResolver,
                        schemaLocation: pluginModifiedSchemaLocation.schemaLocation,
                    }
                );

                pluginResolverMapping.forEach(
                    (pluginResolverMappingItem: FormPluginResolverSchemaMap): void => {
                        if (typeof pluginResolverMappingItem.schema === "undefined") {
                            unset(mappedSchema, pluginResolverMappingItem.schemaLocation);
                        } else {
                            set(
                                mappedSchema,
                                pluginResolverMappingItem.schemaLocation,
                                pluginResolverMappingItem.schema
                            );
                        }
                    }
                );
            }
        }
    );

    return mappedSchema;
}

/**
 * Finds the schema locations of types mapped to plugins
 */
export function getSchemaLocationsOfPlugins(
    schema: any,
    schemaLocationPrefix: string = ""
): FormPluginLocation[] {
    const schemaLocationsOfPlugins: FormPluginLocation[] = [];

    // get all schema locations
    const schemaLocations: string[] = getLocationsFromObject(schema).concat([""]);

    // determine if the schema location is mapped to a plugin
    schemaLocations.forEach(
        (schemaLocation: string): void => {
            const subSchema: any =
                schemaLocation === "" ? schema : get(schema, schemaLocation);

            const schemaLocationOfPlugin: string =
                schemaLocationPrefix === ""
                    ? schemaLocation
                    : `${schemaLocationPrefix}.${schemaLocation}`;

            // check to see if the schema location matches with the current schema and includes a plugin identifier
            if (
                typeof get(subSchema, pluginIdKeyword) === "string" &&
                schemaLocationsOfPlugins.findIndex(
                    pluginPartialFindIndexCallback(schemaLocationOfPlugin)
                ) === -1
            ) {
                schemaLocationsOfPlugins.push({
                    schema,
                    schemaLocation: schemaLocationOfPlugin,
                });
            }
        }
    );

    return schemaLocationsOfPlugins;
}

/**
 * Callback to determine if a string is found within an array of plugin locations
 */
function pluginPartialFindIndexCallback(
    schemaLocation: string
): (formPluginLocation: FormPluginLocation) => boolean {
    return (formPluginLocation: FormPluginLocation): boolean => {
        return (
            schemaLocation.slice(0, formPluginLocation.schemaLocation.length) ===
            formPluginLocation.schemaLocation
        );
    };
}

/**
 * Get the resolved data from a plugin and the schema location to map to
 */
function getPluginResolverSchemaMap(
    pluginResolverSchemaMapConfig: FormPluginResolverSchemaMapConfig
): FormPluginResolverSchemaMap[] {
    const pluginResolverMapping: FormPluginResolverSchemaMap[] = [];

    const pluginResolverMappingItem: FormPluginResolverSchemaMap = {
        schemaLocation: pluginResolverSchemaMapConfig.schemaLocation,
        schema: pluginResolverSchemaMapConfig.pluginResolver.resolver(
            pluginResolverSchemaMapConfig.pluginSchema,
            pluginResolverSchemaMapConfig.pluginData
        ),
    };

    pluginResolverMapping.push(pluginResolverMappingItem);

    return pluginResolverMapping;
}
