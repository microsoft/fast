import React, { ComponentClass, FunctionComponent } from "react";
import { MapperConfig } from "@microsoft/fast-tooling";

export interface ComponentDictionary {
    [key: string]: FunctionComponent<any> | ComponentClass<any> | string;
}

/**
 * A mapping function intended to be used with the
 * `mapDataDictionary` export from the @microsoft/fast-tooling library
 */
export function reactMapper(
    componentDictionary: ComponentDictionary
): (config: MapperConfig<JSX.Element>) => JSX.Element {
    return (config: MapperConfig<JSX.Element>): JSX.Element => {
        return React.createElement(
            componentDictionary[config.schema.id],
            config.resolvedData
        );
    };
}
