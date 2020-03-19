import React, { ComponentClass, FunctionComponent } from "react";
import {
    dictionaryLink,
    MapperConfig,
    PropertyKeyword,
    ResolverConfig,
} from "@microsoft/fast-tooling";

export interface ComponentDictionary {
    [key: string]: FunctionComponent<any> | ComponentClass<any> | string;
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

        // a list of available slots for this element
        const availableLinkedDataIds = allAvailableProps.filter((propName: string) => {
            if (config.schema[PropertyKeyword.properties][propName][dictionaryLink]) {
                return propName;
            }
        });

        // a list of attributes for this element
        const props = allAvailableProps.filter(potentialProp => {
            // remove slots from the attributes list
            return !availableLinkedDataIds.includes(potentialProp);
        });

        config.dataDictionary[0][config.dictionaryId].data = {
            component: componentDictionary[config.schema.id],
            props: props.reduce((previousValue: {}, currentValue: string) => {
                return {
                    ...previousValue,
                    [currentValue]: allAvailableProps[currentValue],
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
        let childrenData =
            config.dataDictionary[0][
                config.dataDictionary[0][config.dictionaryId].parent.id
            ].data.props[
                config.dataDictionary[0][config.dictionaryId].parent.dataLocation
            ];
        let childItem;

        if (typeof config.dataDictionary[0][config.dictionaryId].data === "string") {
            childItem = config.dataDictionary[0][config.dictionaryId].data;
        } else {
            childItem = React.createElement(
                config.dataDictionary[0][config.dictionaryId].data.component,
                {
                    ...config.dataDictionary[0][config.dictionaryId].data.props,
                    key: Array.isArray(childrenData) ? childrenData.length : 0,
                }
            );
        }

        childrenData =
            childrenData === undefined ? [childItem] : [childItem, ...childrenData];

        config.dataDictionary[0][
            config.dataDictionary[0][config.dictionaryId].parent.id
        ].data.props[
            config.dataDictionary[0][config.dictionaryId].parent.dataLocation
        ] = childrenData;
    }

    if (typeof config.dataDictionary[0][config.dictionaryId].data === "string") {
        return config.dataDictionary[0][config.dictionaryId].data;
    }

    return React.createElement(
        config.dataDictionary[0][config.dictionaryId].data.component,
        config.dataDictionary[0][config.dictionaryId].data.props
    );
}
