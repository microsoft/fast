type FastContextMetaData = "$fast_context";
type FastContextsMetaData = "$fast_parent_contexts";

/**
 * Describes a child custom element binding referenced by a schema path.
 * @public
 */
export interface ChildrenMap {
    customElementName: string;
    attributeName: string;
}

/**
 * A reusable JSON schema definition.
 * @public
 */
export interface JSONSchemaDefinition extends JSONSchemaCommon {
    $fast_context: string;
    $fast_parent_contexts: Array<string>;
}

/**
 * Common properties shared by schema nodes.
 * @public
 */
export interface JSONSchemaCommon {
    type?: string;
    properties?: any;
    items?: any;
    anyOf?: Array<any>;
    $ref?: string;
    /**
     * Stamped by `applyConfigToSchema` when an `ObserverMapConfig` excludes
     * this path. When `false`, the proxy system skips observation for this
     * node and (if all descendants are also `false`) its subtree.
     */
    $observe?: boolean;
}

/**
 * A JSON schema describing a root property.
 * @public
 */
export interface JSONSchema extends JSONSchemaCommon {
    $schema: string;
    $id: string;
    $defs?: Record<string, JSONSchemaDefinition>;
}

/**
 * Common metadata for paths cached while parsing a template.
 * @public
 */
export interface CachedPathCommon {
    parentContext: string | null;
    currentContext: string | null;
    path: string;
}

/**
 * A path discovered from an access expression.
 * @public
 */
export interface AccessCachedPath extends CachedPathCommon {
    type: "access";
}

/**
 * A path discovered from a default binding.
 * @public
 */
export interface DefaultCachedPath extends CachedPathCommon {
    type: "default";
}

/**
 * A path discovered from an event binding.
 * @public
 */
export interface EventCachedPath extends CachedPathCommon {
    type: "event";
}

/**
 * A path discovered from a repeat directive.
 * @public
 */
export interface RepeatCachedPath extends CachedPathCommon {
    type: "repeat";
}

/**
 * A path discovered while parsing a template.
 * @public
 */
export type CachedPath =
    | DefaultCachedPath
    | RepeatCachedPath
    | AccessCachedPath
    | EventCachedPath;

/**
 * A map from element names and root properties to JSON schemas.
 * @public
 */
export type CachedPathMap = Map<string, Map<string, JSONSchema>>;

/**
 * Configuration for registering a path with a schema.
 * @public
 */
export interface RegisterPathConfig {
    rootPropertyName: string;
    pathConfig: CachedPath;
    childrenMap: ChildrenMap | null;
}

// The context, in most cases the array property e.g. users
export const fastContextMetaData: FastContextMetaData = "$fast_context";
// The list of contexts preceeding this context, the first of which should be the root property
export const fastContextsMetaData: FastContextsMetaData = "$fast_parent_contexts";

export const defsPropertyName = "$defs";
export const refPropertyName = "$ref";

/**
 * Module-level registry that maps custom element names to their schema maps.
 * Used for cross-element `$ref` resolution (e.g. nested element schemas).
 * Each Schema instance registers itself here on construction.
 * @public
 */
export const schemaRegistry: CachedPathMap = new Map();

/**
 * A constructed JSON schema from a template
 * @public
 */
export class Schema {
    /**
     * The name of the custom element
     */
    private customElementName: string;

    /**
     * Instance-level JSON schema map describing each root property
     */
    private schemaMap: Map<string, JSONSchema>;

    constructor(name: string) {
        this.customElementName = name;
        this.schemaMap = new Map();
        schemaRegistry.set(name, this.schemaMap);
    }

    /**
     * Add a path to a schema
     * @param config - The path registration configuration.
     */
    public addPath(config: RegisterPathConfig) {
        const splitPath = this.getSplitPath(config.pathConfig.path);
        let schema: JSONSchema | undefined = this.schemaMap.get(config.rootPropertyName);
        let childRef: string | null = null;

        // Create a root level property JSON
        if (!schema) {
            this.addNewSchema(config.rootPropertyName);
            schema = this.schemaMap.get(config.rootPropertyName) as JSONSchema;
        }

        if (config.childrenMap) {
            childRef = this.getSchemaId(
                config.childrenMap.customElementName,
                config.childrenMap.attributeName,
            );

            if (splitPath.length === 1) {
                schema.anyOf
                    ? schema.anyOf.push({ [refPropertyName]: childRef })
                    : (schema.anyOf = [{ [refPropertyName]: childRef }]);
            }
        }

        switch (config.pathConfig.type) {
            case "default":
            case "access": {
                if (splitPath.length > 1) {
                    if (config.pathConfig.currentContext === null) {
                        this.addPropertiesToAnObject(
                            schema,
                            splitPath.slice(1),
                            config.pathConfig.currentContext,
                            childRef,
                        );
                    } else {
                        if (!schema[defsPropertyName]?.[splitPath[0]]) {
                            schema[defsPropertyName] = {
                                ...schema[defsPropertyName],
                                [splitPath[0]]: {} as any,
                            };
                        }

                        this.addPropertiesToAContext(
                            schema[defsPropertyName][splitPath[0]],
                            splitPath.slice(1),
                            config.pathConfig.currentContext as string,
                            childRef,
                        );
                    }
                }

                break;
            }
            case "repeat": {
                this.addContext(
                    schema,
                    splitPath[splitPath.length - 1] as string, // example items
                    config.pathConfig.currentContext as string, // example item
                    config.pathConfig.parentContext,
                );

                if (splitPath.length > 2) {
                    let updatedSchema = schema;
                    const hasParentContext: boolean = !!config.pathConfig.parentContext;

                    if (hasParentContext) {
                        updatedSchema = this.addPropertiesToAnObject(
                            schema[defsPropertyName]?.[
                                config.pathConfig.parentContext as string
                            ],
                            splitPath.slice(1, -1),
                            config.pathConfig.parentContext,
                            childRef,
                        );
                    }

                    this.addPropertiesToAnObject(
                        updatedSchema,
                        hasParentContext ? splitPath.slice(2) : splitPath.slice(1),
                        config.pathConfig.currentContext,
                        childRef,
                        "array",
                    );
                } else if (splitPath.length > 1) {
                    let schemaDefinition;

                    if (config.pathConfig.parentContext) {
                        schemaDefinition = schema?.[defsPropertyName]?.[
                            config.pathConfig.parentContext
                        ] as JSONSchemaDefinition;
                    }

                    this.addPropertiesToAnObject(
                        schemaDefinition ?? schema,
                        splitPath.slice(1),
                        config.pathConfig.currentContext,
                        childRef,
                        "array",
                    );
                } else {
                    schema.type = "array";
                    schema[refPropertyName] = this.getDefsPath(
                        config.pathConfig.currentContext as string,
                    );
                }

                break;
            }
        }
    }

    /**
     * Gets the JSON schema for a property name
     * @param rootPropertyName - the root property the JSON schema is mapped to
     * @returns The JSON schema for the root property
     */
    public getSchema(rootPropertyName: string): JSONSchema | null {
        return this.schemaMap.get(rootPropertyName) ?? null;
    }

    /**
     * Gets root properties
     * @returns IterableIterator<string>
     */
    public getRootProperties(): IterableIterator<string> {
        return this.schemaMap.keys();
    }

    /**
     * Get a path split into property names
     * @param path - The dot syntax path, e.g. `a.b.c`.
     * @returns An array of items in the path
     */
    private getSplitPath(path: string): string[] {
        return path.split(".");
    }

    /**
     * Gets the path to the $def
     * @param context - The context name. For example, `item in items` creates the `item` context.
     * @returns A string to use as a $ref
     */
    private getDefsPath(context: string): string {
        return `#/${defsPropertyName}/${context}`;
    }

    /**
     * Get the schema $id
     * @param customElementName - The custom element name
     * @param propertyName - The property name
     * @returns The ID that can be used in the JSON schema as $id
     */
    private getSchemaId(customElementName: string, propertyName: string): string {
        return `https://fast.design/schemas/${customElementName}/${propertyName}.json`;
    }

    /**
     * Add a new JSON schema to the JSON schema map
     * @param propertyName - The name of the property to assign this JSON schema to.
     */
    private addNewSchema(propertyName: string): void {
        this.schemaMap.set(propertyName, {
            $schema: "https://json-schema.org/draft/2019-09/schema",
            $id: this.getSchemaId(this.customElementName, propertyName),
            [defsPropertyName]: {},
        });
    }

    /**
     * Add properties to a context
     * @param schema - The schema to add the properties to.
     * @param splitPath - The path split into property/context names.
     * @param context - The path context.
     */
    private addPropertiesToAContext(
        schema: any,
        splitPath: string[],
        context: string,
        childRef: string | null,
    ) {
        schema.type = "object";

        if (schema.properties && !schema.properties[splitPath[0]]) {
            schema.properties[splitPath[0]] = {};
        } else if (!schema.properties) {
            schema.properties = {
                [splitPath[0]]: {},
            };
        }

        if (splitPath.length > 1) {
            this.addPropertiesToAnObject(
                schema.properties[splitPath[0]],
                splitPath.slice(1),
                context,
                childRef,
            );
        } else if (childRef) {
            if (schema.properties[splitPath[0]].anyOf) {
                schema.properties[splitPath[0]].anyOf.push({
                    [refPropertyName]: childRef,
                });
            } else {
                schema.properties[splitPath[0]].anyOf = [{ [refPropertyName]: childRef }];
            }
        }
    }

    /**
     * Add properties to an object
     * @param schema - The schema to add the properties to.
     * @param splitPath - The path split into property/context names.
     * @param context - The path context.
     * @param type - The data type (see JSON schema for details).
     */
    private addPropertiesToAnObject(
        schema: any,
        splitPath: string[],
        context: string | null,
        childRef: string | null,
        type: string = "object",
    ): any {
        schema.type = "object";

        if (schema.properties && !schema.properties[splitPath[0]]) {
            schema.properties[splitPath[0]] = {};
        } else if (!schema.properties) {
            schema.properties = {
                [splitPath[0]]: {},
            };
        }

        if (type === "object" && splitPath.length > 1) {
            return this.addPropertiesToAnObject(
                schema.properties[splitPath[0]],
                splitPath.slice(1),
                context,
                childRef,
                type,
            );
        } else if (type === "array") {
            if (splitPath.length > 1) {
                return this.addPropertiesToAnObject(
                    schema.properties[splitPath[0]],
                    splitPath.slice(1),
                    context,
                    childRef,
                    type,
                );
            } else {
                return this.addArrayToAnObject(
                    schema.properties[splitPath[0]],
                    context as string,
                );
            }
        }

        if (schema.properties[splitPath[0]].anyOf && childRef) {
            schema.properties[splitPath[0]].anyOf.push({ [refPropertyName]: childRef });
        } else if (childRef) {
            schema.properties[splitPath[0]].anyOf = [{ [refPropertyName]: childRef }];
        }

        return schema.properties[splitPath[0]];
    }

    /**
     * Add an array to an object property
     * @param schema - The schema to add the properties to.
     * @param context - The name of the context.
     */
    private addArrayToAnObject(schema: any, context: string): any {
        schema.type = "array";
        schema.items = {
            [refPropertyName]: this.getDefsPath(context),
        };

        return schema.items;
    }

    /**
     * Add a context to the $defs property
     * @param schema - The schema to use.
     * @param propertyName - The name of the property the context belongs to.
     * @param currentContext - The current context.
     * @param parentContext - The parent context.
     * @returns
     */
    private addContext(
        schema: any,
        propertyName: string, // e.g items
        currentContext: string, // e.g. item
        parentContext: string | null,
    ): void {
        if (schema[defsPropertyName][currentContext]) {
            return;
        }

        schema[defsPropertyName][currentContext] = {
            [fastContextMetaData]: propertyName,
            [fastContextsMetaData]: this.getParentContexts(schema, parentContext),
        };
    }

    /**
     * Get parent contexts
     * @param schema - The schema to use.
     * @param parentContext - The parent context.
     * @param contexts - A list of parent contexts.
     * @returns
     */
    private getParentContexts(
        schema: JSONSchema,
        parentContext: string | null,
        contexts: Array<string | null> = [],
    ): Array<string | null> {
        if (parentContext === null) {
            return [null, ...contexts];
        }

        const parentParentContext: Array<string | null> = schema?.[defsPropertyName]?.[
            parentContext as string
        ][fastContextsMetaData] as Array<string | null>;

        return this.getParentContexts(
            schema,
            parentParentContext[parentParentContext.length - 1] as string | null,
            [parentContext, ...contexts],
        );
    }
}
