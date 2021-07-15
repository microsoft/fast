import { get } from "lodash-es";
import {
    CombiningKeyword,
    DataType,
    itemsKeyword,
    PropertyKeyword,
} from "../data-utilities/types";
function getNavigationRecursive(
    schema,
    disabled,
    displayTextDataLocation,
    data,
    dictionaryParent,
    dataLocation = "",
    schemaLocation = "",
    parent = null,
    id
) {
    const self = id || dataLocation;
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    const items = getNavigationItems(
        schema,
        disabled,
        data,
        dataLocation,
        schemaLocation,
        self,
        displayTextDataLocation
    );
    const text =
        typeof displayTextDataLocation === "string"
            ? get(data, displayTextDataLocation, schema.title)
            : schema.title;
    return [
        Object.assign(
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
                    text,
                    type: schema.type || DataType.unknown,
                    items: items.map(item => {
                        return item[1];
                    }),
                },
            },
            items.reduce((accum, item) => {
                return Object.assign(Object.assign({}, accum), item[0]);
            }, {})
        ),
        self,
    ];
}
export function getNavigation(schema, data, parent, displayTextDataLocation) {
    return getNavigationRecursive(
        schema,
        !!schema.disabled,
        displayTextDataLocation,
        data,
        parent
    );
}
export function getNavigationDictionary(schemaDictionary, data, displayTextDataLocation) {
    const navigationConfigs = [];
    Object.keys(data[0]).forEach(dataKey => {
        navigationConfigs.push([
            {
                [dataKey]: getNavigation(
                    schemaDictionary[data[0][dataKey].schemaId],
                    data[0][dataKey].data,
                    data[0][dataKey].parent,
                    displayTextDataLocation
                ),
            },
            dataKey,
        ]);
    });
    return [
        navigationConfigs.reduce((accum, navigationConfig) => {
            accum[navigationConfig[1]] = navigationConfig[0][navigationConfig[1]];
            return accum;
        }, {}),
        data[1],
    ];
}
function getNavigationItems(
    schema,
    disabled,
    data,
    dataLocation,
    schemaLocation,
    parent,
    displayTextDataLocation
) {
    const combiningKeyword = schema[CombiningKeyword.oneOf]
        ? CombiningKeyword.oneOf
        : schema[CombiningKeyword.anyOf]
        ? CombiningKeyword.anyOf
        : void 0;
    if (combiningKeyword) {
        return schema[combiningKeyword].map((subSchema, index) => {
            const schemaLocationIsRoot = schemaLocation === "";
            const currentSchemaLocation = schemaLocationIsRoot
                ? `${combiningKeyword}[${index}]`
                : `${schemaLocation}.${combiningKeyword}[${index}]`;
            const currentId = `${dataLocation}{${schemaLocation}${
                schemaLocationIsRoot ? "" : "."
            }${combiningKeyword}[${index}]}`;
            return getNavigationRecursive(
                subSchema,
                disabled || !!subSchema.disabled,
                displayTextDataLocation,
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
                return Object.keys(schema.properties).map(propertyKey => {
                    return getNavigationRecursive(
                        schema.properties[propertyKey],
                        disabled || !!schema.properties[propertyKey].disabled,
                        displayTextDataLocation,
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
                return data.map((value, index) => {
                    return getNavigationRecursive(
                        schema.items,
                        disabled || !!schema.items.disabled,
                        displayTextDataLocation,
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
