import { ComponentClass, FunctionComponent } from "react";
import { MapperConfig, ResolverConfig } from "@microsoft/fast-tooling";
export interface ReactMapDataDictionaryPlugin {
    /**
     * The ids that map to the pluginIdKeyword in the JSON schema
     */
    ids: string[];
    /**
     * The mapping function that returns the mapped values
     */
    mapper: (data: any) => any;
    /**
     * The resolving function that returns the mapped values
     */
    resolver: (data: any) => any;
}
export interface ComponentDictionary {
    [key: string]: FunctionComponent<any> | ComponentClass<any> | string;
}
/**
 * A mapping function intended to be used with the
 * `mapDataDictionary` export from the @microsoft/fast-tooling library
 */
export declare function reactMapper(
    componentDictionary: ComponentDictionary
): (config: MapperConfig<JSX.Element>) => void;
/**
 * A resolver function intended to be used with the
 * `mapDataDictionary` export from the @microsoft/fast-tooling library
 */
export declare function reactResolver(config: ResolverConfig<unknown>): any;
