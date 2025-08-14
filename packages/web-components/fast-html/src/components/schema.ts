type FastContextMetaData = "$fast_context";
type FastContextsMetaData = "$fast_parent_contexts";

interface JSONSchemaDefinition extends JSONSchemaCommon {
    $fast_context: string;
    $fast_parent_contexts: Array<string>;
}

interface JSONSchemaCommon {
    type?: string;
    properties?: any;
}

interface JSONSchema extends JSONSchemaCommon {
    $schema: string;
    $id: string;
    $defs?: Record<string, JSONSchemaDefinition>;
    $ref?: string;
}

type AccessCachedPathType = "access";

export interface AccessCachedPath {
    type: AccessCachedPathType;
    currentContext: string | null;
    path: string;
}

type DefaultCachedPathType = "default";

export interface DefaultCachedPath {
    type: DefaultCachedPathType;
    currentContext: string | null;
    path: string;
}

type EventCachedPathType = "event";

export interface EventCachedPath {
    type: EventCachedPathType;
    currentContext: string | null;
    path: string;
}

type RepeatCachedPathType = "repeat";

export interface RepeatCachedPath {
    type: RepeatCachedPathType;
    parentContext: string | null;
    currentContext: string;
    path: string;
}

export type CachedPath =
    | DefaultCachedPath
    | RepeatCachedPath
    | AccessCachedPath
    | EventCachedPath;

export type CachedPathMap = Record<string, JSONSchema>;

interface RegisterPathConfig {
    rootPropertyName: string;
    pathConfig: CachedPath;
}

// The context, in most cases the array property e.g. users
const fastContextMetaData: FastContextMetaData = "$fast_context";
// The list of contexts preceeding this context, the first of which should be the root property
const fastContextsMetaData: FastContextsMetaData = "$fast_parent_contexts";

const defsPropertyName = "$defs";
const refPropertyName = "$ref";

/**
 * A constructed JSON schema from a template
 */
export class Schema {
    /**
     * The name of the custom element
     */
    private customElementName: string;

    /**
     * A JSON schema describing each root schema
     */
    private jsonSchemaMap: CachedPathMap = {};

    constructor(name: string) {
        this.customElementName = name;
    }

    /**
     * Add a path to a schema
     * @param config RegisterPathConfig
     */
    public addPath(config: RegisterPathConfig) {
        const splitPath = this.getSplitPath(config.pathConfig.path);

        // Create a root level property JSON
        if (!this.jsonSchemaMap[config.rootPropertyName]) {
            this.addNewSchema(config.rootPropertyName);
        }

        switch (config.pathConfig.type) {
            case "default":
            case "access": {
                if (config.pathConfig.currentContext === null) {
                    this.addPropertiesToAnObject(
                        this.jsonSchemaMap[config.rootPropertyName],
                        splitPath.slice(1),
                        config.pathConfig.currentContext
                    );
                } else {
                    this.addPropertiesToAContext(
                        this.jsonSchemaMap?.[config.rootPropertyName]?.[
                            defsPropertyName
                        ]?.[splitPath[0]],
                        splitPath.slice(1),
                        config.pathConfig.currentContext
                    );
                }

                break;
            }
            case "repeat": {
                this.addContext(
                    this.jsonSchemaMap[config.rootPropertyName],
                    splitPath[splitPath.length - 1], // example items
                    config.pathConfig.currentContext, // example item
                    config.pathConfig.parentContext
                );

                if (splitPath.length > 2) {
                    let schema = this.jsonSchemaMap[config.rootPropertyName];

                    if (config.pathConfig.parentContext) {
                        schema = this.addPropertiesToAnObject(
                            this.jsonSchemaMap[config.rootPropertyName][
                                defsPropertyName
                            ]?.[config.pathConfig.parentContext],
                            splitPath.slice(1, -1),
                            config.pathConfig.parentContext
                        );
                    }

                    this.addPropertiesToAnObject(
                        schema,
                        splitPath.slice(-1),
                        config.pathConfig.currentContext,
                        "array"
                    );
                } else if (splitPath.length > 1) {
                    this.addPropertiesToAnObject(
                        this.jsonSchemaMap[config.rootPropertyName],
                        splitPath.slice(1),
                        config.pathConfig.currentContext,
                        "array"
                    );
                } else {
                    this.jsonSchemaMap[config.rootPropertyName].type = "array";
                    this.jsonSchemaMap[config.rootPropertyName][refPropertyName] =
                        this.getDefsPath(config.pathConfig.currentContext);
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
        return this.jsonSchemaMap[rootPropertyName] ?? null;
    }

    /**
     * Get a path split into property names
     * @param path The dot syntax path e.g. a.b.c
     * @returns An array of items in the path
     */
    private getSplitPath(path: string): string[] {
        return path.split(".");
    }

    /**
     * Gets the path to the $def
     * @param context The context name e.g. {{item in items}} in a repeat creates the "item" context
     * @returns A string to use as a $ref
     */
    private getDefsPath(context: string): string {
        return `#/${defsPropertyName}/${context}`;
    }

    /**
     * Add a new JSON schema to the JSON schema map
     * @param propertyName The name of the property to assign this JSON schema to
     */
    private addNewSchema(propertyName: string): void {
        this.jsonSchemaMap[propertyName] = {
            $schema: "https://json-schema.org/draft/2019-09/schema",
            $id: `https://fast.design/schemas/${this.customElementName}/${propertyName}.json`,
            [defsPropertyName]: {},
        };
    }

    /**
     * Add properties to a context
     * @param schema The schema to add the properties to
     * @param splitPath The path split into property/context names
     * @param context The paths context
     */
    private addPropertiesToAContext(schema: any, splitPath: string[], context: string) {
        schema.type = "object";

        if (schema.properties) {
            schema.properties[splitPath[0]] = {};
        } else {
            schema.properties = {
                [splitPath[0]]: {},
            };
        }

        if (splitPath.length > 1) {
            this.addPropertiesToAnObject(
                schema.properties[splitPath[0]],
                splitPath.slice(1),
                context
            );
        }
    }

    /**
     * Add properties to an object
     * @param schema The schema to add the properties to
     * @param splitPath The path split into property/context names
     * @param context The paths context
     * @param type The data type (see JSON schema for details)
     */
    private addPropertiesToAnObject(
        schema: any,
        splitPath: string[],
        context: string | null,
        type: string = "object"
    ): any {
        schema.type = "object";

        if (schema.properties) {
            schema.properties[splitPath[0]] = {};
        } else {
            schema.properties = {
                [splitPath[0]]: {},
            };
        }

        if (context === null && type === "object" && splitPath.length > 1) {
            return this.addPropertiesToAnObject(
                schema.properties[splitPath[0]],
                splitPath.slice(1),
                context,
                type
            );
        } else if (type === "array") {
            if (splitPath.length > 1) {
                return this.addPropertiesToAnObject(
                    schema.properties[splitPath[0]],
                    splitPath.slice(1),
                    context,
                    type
                );
            } else {
                return this.addArrayToAnObject(
                    schema.properties[splitPath[0]],
                    context as string
                );
            }
        }

        return schema.properties[splitPath[0]];
    }

    /**
     * Add an array to an object property
     * @param schema The schema to add the properties to
     * @param context The name of the context
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
     * @param schema The schema to use
     * @param propertyName The name of the property the context belongs to
     * @param currentContext The current context
     * @param parentContext The parent context
     * @returns
     */
    private addContext(
        schema: any,
        propertyName: string, // e.g items
        currentContext: string, // e.g. item
        parentContext: string | null
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
     * @param schema The schema to use
     * @param parentContext The parent context
     * @param contexts A list of parent contexts
     * @returns
     */
    private getParentContexts(
        schema: JSONSchema,
        parentContext: string | null,
        contexts: Array<string | null> = []
    ): Array<string | null> {
        if (parentContext === null) {
            return [null, ...contexts];
        }

        const parentParentContext: string[] = schema?.[defsPropertyName]?.[
            parentContext as string
        ].$fast_parent_contexts as string[];

        return this.getParentContexts(
            schema,
            parentParentContext[parentParentContext.length - 1],
            [parentContext, ...contexts]
        );
    }
}
