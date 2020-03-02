import { get } from "lodash-es";
import {
    TreeNavigation,
    TreeNavigationConfig,
    TreeNavigationConfigDictionary,
} from "./navigation.props";
import { getDataUpdatedWithSourceData, TargetPosition } from "../data-utilities/relocate";
import {
    CombiningKeyword,
    DataType,
    itemsKeyword,
    PropertyKeyword,
} from "../data-utilities/types";
import ajv from "ajv";
import { SchemaDictionary } from "./schema.props";
import { DataDictionary, Parent } from "./data.props";

export function getNavigationDictionary(
    schemaDictionary: SchemaDictionary,
    data: DataDictionary<unknown>
): TreeNavigationConfigDictionary {
    const navigationConfigs: TreeNavigationConfigDictionary[] = [];

    Object.keys(data[0]).forEach((dataKey: string) => {
        navigationConfigs.push([
            {
                [dataKey]: getNavigation(
                    schemaDictionary[data[0][dataKey].schemaId],
                    data[0][dataKey].data,
                    data[0][dataKey].parent
                ),
            },
            dataKey,
        ]);
    });

    return [
        navigationConfigs.reduce(
            (
                accum: { [key: string]: TreeNavigationConfig },
                navigationConfig: TreeNavigationConfigDictionary
            ) => {
                accum[navigationConfig[1]] = navigationConfig[0][navigationConfig[1]];

                return accum;
            },
            {}
        ),
        data[1],
    ];
}

export function getNavigation(
    schema: any,
    data?: any,
    parent?: Parent
): TreeNavigationConfig {
    return getNavigationRecursive(schema, data, parent);
}

function getNavigationRecursive(
    schema: any,
    data?: any,
    dictionaryParent?: Parent,
    dataLocation: string = "",
    schemaLocation: string = "",
    parent: string | null = null,
    id: string = ""
): TreeNavigationConfig {
    const items: TreeNavigationConfig[] = getNavigationItems(
        schema,
        data,
        dataLocation,
        schemaLocation,
        dataLocation
    );
    const self: string = `${id}${dataLocation}`;

    return [
        {
            [self]: {
                self,
                parent,
                parentDictionaryItem:
                    dictionaryParent !== undefined
                        ? {
                              id: dictionaryParent.id,
                              dataLocation: dictionaryParent.dataLocation,
                          }
                        : undefined,
                relativeDataLocation: dataLocation,
                schemaLocation,
                schema,
                data,
                text: schema.title,
                type: schema.type || DataType.unknown,
                items: items.map((item: TreeNavigationConfig) => {
                    return item[1];
                }),
            },
            ...items.reduce(
                (accum: TreeNavigation, item: TreeNavigationConfig): TreeNavigation => {
                    return { ...accum, ...item[0] };
                },
                {}
            ),
        },
        self,
    ];
}

function getCombiningIndex(schema: any, data: any): number {
    let index: number = 0;

    if (data !== undefined) {
        const ajvInstance: ajv.Ajv = new ajv();

        if (Array.isArray(schema)) {
            schema.forEach((schemaItem: any, valueIndex: number) => {
                const valueIndexKey: string = `${valueIndex}`;
                ajvInstance.addSchema(schemaItem, valueIndexKey);

                if (ajvInstance.validate(valueIndexKey, data)) {
                    index = valueIndex;
                    return;
                }
            });
        }
    }

    return index;
}

function getNavigationItems(
    schema: any,
    data: any,
    dataLocation: string = "",
    schemaLocation: string = "",
    parent: string = ""
): TreeNavigationConfig[] {
    const combiningKeyword: CombiningKeyword | void = schema[CombiningKeyword.oneOf]
        ? CombiningKeyword.oneOf
        : schema[CombiningKeyword.anyOf]
            ? schema[CombiningKeyword.anyOf]
            : void 0;

    if (combiningKeyword) {
        const combiningIndex: number = getCombiningIndex(schema[combiningKeyword], data);
        const currentSchemaLocation: string =
            schemaLocation === ""
                ? `${combiningKeyword}[${combiningIndex}]`
                : `${schemaLocation}.${combiningKeyword}[${combiningIndex}]`;

        return [
            getNavigationRecursive(
                schema[combiningKeyword][combiningIndex],
                data,
                undefined,
                dataLocation,
                currentSchemaLocation,
                parent,
                currentSchemaLocation
            ),
        ];
    }

    switch (schema.type) {
        case DataType.object:
            if (schema.properties) {
                return Object.keys(schema.properties).map((propertyKey: string) => {
                    return getNavigationRecursive(
                        schema.properties[propertyKey],
                        get(data, propertyKey) ? data[propertyKey] : void 0,
                        undefined,
                        dataLocation ? `${dataLocation}.${propertyKey}` : propertyKey,
                        schemaLocation
                            ? `${schemaLocation}.${
                                  PropertyKeyword.properties
                              }.${propertyKey}`
                            : `${PropertyKeyword.properties}.${propertyKey}`,
                        parent
                    );
                });
            }
        case DataType.array:
            if (schema.items && Array.isArray(data)) {
                return data.map((value: any, index: number) => {
                    return getNavigationRecursive(
                        schema.items,
                        data[index],
                        undefined,
                        dataLocation ? `${dataLocation}[${index}]` : `[${index}]`,
                        schemaLocation
                            ? `${schemaLocation}.${itemsKeyword}`
                            : `${itemsKeyword}`,
                        parent
                    );
                });
            }
    }

    return [];
}
