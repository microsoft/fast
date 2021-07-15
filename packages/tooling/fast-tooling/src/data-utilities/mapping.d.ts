import { DataDictionary, SchemaDictionary } from "../message-system";
import { ElementDictionary } from "./types";
import { WebComponentDefinition } from "./web-component";
export declare const dataSetName: string;
export interface MapperConfig<T> {
    /**
     * Data that maps to the JSON schema
     */
    dataDictionary: DataDictionary<any>;
    /**
     * The ID of the current dictionary item
     */
    dictionaryId: string;
    /**
     * JSON schema
     */
    schema: any;
    /**
     * The plugins used to map data
     */
    mapperPlugins: MapDataPlugin[];
}
export interface MapDataPlugin {
    /**
     * The ids that map to the pluginIdKeyword in the JSON schema
     */
    ids: string[];
    /**
     * The mapping function that returns the mapped values
     */
    mapper: (data: any) => any;
    /**
     * The resolving function that overrides the resolver
     */
    resolver: (data: any) => any;
}
export interface MapDataConfig<T> {
    /**
     * Data that maps to the JSON schema
     */
    dataDictionary: DataDictionary<any>;
    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;
    /**
     * The mapper that will update the data in the dictionary
     */
    mapper: (config: MapperConfig<T>) => T;
    /**
     * The resolver that resolves the data dictionary into another structure
     */
    resolver: (config: ResolverConfig<T>) => T;
    /**
     * The plugins used to map data
     */
    plugins?: MapDataPlugin[];
}
interface ResolveDataInDataDictionaryConfig<T> {
    /**
     * The dictionary of data
     */
    dataDictionary: DataDictionary<unknown>;
    /**
     * The dictionary of data key
     */
    dictionaryId: string;
    /**
     * The array of resolved IDs
     */
    resolvedDictionaryIds: string[];
    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;
    /**
     * The mapping function
     */
    mapper: (config: MapperConfig<T>) => T;
    /**
     * The plugins used to map data
     */
    mapperPlugins: MapDataPlugin[];
}
export interface ResolverConfig<T> {
    /**
     * The data resolved to a specified type
     */
    resolvedData: T;
    /**
     * The dictionary of data
     */
    dataDictionary: DataDictionary<any>;
    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;
    /**
     * The ID of the item in the dictionary
     */
    dictionaryId: string;
    /**
     * The parent of the dictionary item
     */
    parent: string | null;
    /**
     * The plugins used to resolve data
     */
    resolverPlugins: MapDataPlugin[];
}
export declare function resolveDataInDataDictionary<T>(
    config: ResolveDataInDataDictionaryConfig<T>
): void;
export declare function mapDataDictionary<T>(config: MapDataConfig<T>): T;
/**
 * This is the HTML mapper to be used with mapDataDictionary
 * which will map items in the data dictionary to HTMLElement or Text
 */
export declare function htmlMapper(
    elementDictionary: ElementDictionary
): (config: MapperConfig<string>) => void;
/**
 * The resolver for an HTML data dictionary
 */
export declare function htmlResolver(config: ResolverConfig<any>): HTMLElement | Text;
/**
 * The converter for a web component definition
 * to a web component JSON schema
 */
export declare function mapWebComponentDefinitionToJSONSchema(
    webComponentDefinition: WebComponentDefinition
): {
    [key: string]: any;
}[];
export {};
