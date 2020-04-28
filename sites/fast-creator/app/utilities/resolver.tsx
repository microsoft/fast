import React from "react";
import { ResolverConfig } from "@microsoft/fast-tooling";
import { uniqueId } from "lodash-es";
import { Wrapper } from "./wrapper";

/**
 * A resolver function intended to be used with the
 * `mapDataDictionary` export from the @microsoft/fast-tooling library
 */
export function reactResolver(
    activeDictionaryId: string | null,
    honUpdateDictionaryId: (dictionaryId: string) => void
): (config: ResolverConfig<unknown> | any) => any {
    return (config: ResolverConfig<unknown> | any): any => {
        if (config.dataDictionary[1] !== config.dictionaryId) {
            // the original data in the children location
            const childrenAtLocation =
                config.dataDictionary[0][
                    config.dataDictionary[0][config.dictionaryId].parent.id
                ].data.props[
                    config.dataDictionary[0][config.dictionaryId].parent.dataLocation
                ];
            // the child item being resolved to a react component
            const newChildrenAtLocation =
                typeof config.dataDictionary[0][config.dictionaryId].data === "string" ? (
                    config.dataDictionary[0][config.dictionaryId].data
                ) : (
                    <Wrapper
                        dictionaryId={config.dictionaryId}
                        activeDictionaryId={activeDictionaryId}
                        onUpdateDictionaryId={honUpdateDictionaryId}
                        key={uniqueId("wrapper")}
                    >
                        {React.createElement(
                            config.dataDictionary[0][config.dictionaryId].data.component,
                            {
                                ...config.dataDictionary[0][config.dictionaryId].data
                                    .props,
                                key: Array.isArray(childrenAtLocation)
                                    ? childrenAtLocation.length
                                    : 0,
                            }
                        )}
                    </Wrapper>
                );

            // re-assign this prop with the new child item
            config.dataDictionary[0][
                config.dataDictionary[0][config.dictionaryId].parent.id
            ].data.props[
                config.dataDictionary[0][config.dictionaryId].parent.dataLocation
            ] =
                childrenAtLocation === undefined
                    ? [newChildrenAtLocation]
                    : [newChildrenAtLocation, ...childrenAtLocation];
        }

        if (typeof config.dataDictionary[0][config.dictionaryId].data === "string") {
            return config.dataDictionary[0][config.dictionaryId].data;
        }

        return (
            <Wrapper
                dictionaryId={config.dictionaryId}
                activeDictionaryId={activeDictionaryId}
                onUpdateDictionaryId={honUpdateDictionaryId}
                key={uniqueId("wrapper")}
            >
                {React.createElement(
                    config.dataDictionary[0][config.dictionaryId].data.component,
                    config.dataDictionary[0][config.dictionaryId].data.props
                )}
            </Wrapper>
        );
    };
}
