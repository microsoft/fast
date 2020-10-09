import { get } from "lodash-es";
import {
    CombiningKeyword,
    DataType,
    itemsKeyword,
    PropertyKeyword,
} from "../data-utilities/types";
import {
    NavigationConfig,
    NavigationConfigDictionary,
    TreeNavigation,
} from "./navigation.props";
import { SchemaDictionary } from "./schema.props";
import { DataDictionary, Parent } from "./data.props";

function testChange(schema: any) {
    console.log("this is a test");
}

function getNavigationRecursive(
    schema: any,
    disabled: boolean,
    data?: any,
    dictionaryParent?: Parent,
    dataLocation: string = "",
    schemaLocation: string = "",
    parent: string | null = null,
    id?: string
): NavigationConfig {
    const self: string = id || dataLocation;
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    const items: NavigationConfig[] = getNavigationItems(
        schema,
        disabled,
        data,
        dataLocation,
        schemaLocation,
        self
    );

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
                disabled,
                data,
                text: schema.title,
                type: schema.type || DataType.unknown,
                items: items.map((item: NavigationConfig) => {
                    return item[1];
                }),
            },
            ...items.reduce(
                (accum: TreeNavigation, item: NavigationConfig): TreeNavigation => {
                    return { ...accum, ...item[0] };
                },
                {}
            ),
        },
        self,
    ];
}

export function getNavigation(
    schema: any,
    data?: any,
    parent?: Parent
): NavigationConfig {
    return getNavigationRecursive(schema, !!schema.disabled, data, parent);
}

export function getNavigationDictionary(
    schemaDictionary: SchemaDictionary,
    data: DataDictionary<unknown>
): NavigationConfigDictionary {
    const navigationConfigs: NavigationConfigDictionary[] = [];

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
                accum: { [key: string]: NavigationConfig },
                navigationConfig: NavigationConfigDictionary
            ) => {
                accum[navigationConfig[1]] = navigationConfig[0][navigationConfig[1]];

                return accum;
            },
            {}
        ),
        data[1],
    ];
}

function getNavigationItems(
    schema: any,
    disabled: boolean,
    data: any,
    dataLocation: string,
    schemaLocation: string,
    parent: string
): NavigationConfig[] {
    const combiningKeyword: CombiningKeyword | void = schema[CombiningKeyword.oneOf]
        ? CombiningKeyword.oneOf
        : schema[CombiningKeyword.anyOf]
        ? CombiningKeyword.anyOf
        : void 0;

    if (combiningKeyword) {
        return schema[combiningKeyword].map((subSchema: any, index: number) => {
            const schemaLocationIsRoot: boolean = schemaLocation === "";
            const currentSchemaLocation: string = schemaLocationIsRoot
                ? `${combiningKeyword}[${index}]`
                : `${schemaLocation}.${combiningKeyword}[${index}]`;
            const currentId: string = `${dataLocation}{${schemaLocation}${
                schemaLocationIsRoot ? "" : "."
            }${combiningKeyword}[${index}]}`;

            return getNavigationRecursive(
                subSchema,
                disabled || !!subSchema.disabled,
                data,
                undefined,
                dataLocation,
                currentSchemaLocation,
                parent,
                currentId
            );
        });
    }

    switch (schema.type) {
        case DataType.object:
            if (schema.properties) {
                return Object.keys(schema.properties).map((propertyKey: string) => {
                    return getNavigationRecursive(
                        schema.properties[propertyKey],
                        disabled || !!schema.properties[propertyKey].disabled,
                        get(data, propertyKey) ? data[propertyKey] : void 0,
                        undefined,
                        dataLocation ? `${dataLocation}.${propertyKey}` : propertyKey,
                        schemaLocation
                            ? `${schemaLocation}.${PropertyKeyword.properties}.${propertyKey}`
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
                        disabled || !!schema.items.disabled,
                        data[index],
                        undefined,
                        `${dataLocation}[${index}]`,
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
