import { set } from "lodash-es";
import { Data, SchemaDictionary } from "../message-system";

export interface MapperConfig {
    /**
     * Data that maps to the JSON schema
     */
    data: any;

    /**
     * The data that has been previously
     * resolved from the mapper
     */
    resolvedData: any;

    /**
     * JSON schema
     */
    schema: any;
}

interface MapDataDictionaryConfig<T> {
    /**
     * The dictionary of data
     */
    dataDictionary: { [key: string]: Data<T> };

    /**
     * The dictionary of data key
     */
    dataDictionaryKey: string;

    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;

    /**
     * The mapping function
     */
    mapper: (config: MapperConfig) => T;
}

/**
 * Maps the data in a dictionary to a mapping function
 * should result in a data tree
 */
export function mapDataDictionary<T>(config: MapDataDictionaryConfig<T>): T {
    const resolvedData: any = config.dataDictionary[config.dataDictionaryKey].data;
    Object.entries(config.dataDictionary).map(
        ([key, value]: [string, Data<any>]): void => {
            if (value.parent && value.parent.id === config.dataDictionaryKey) {
                set(
                    resolvedData,
                    value.parent.dataLocation,
                    mapDataDictionary({
                        dataDictionary: config.dataDictionary,
                        dataDictionaryKey: key,
                        schemaDictionary: config.schemaDictionary,
                        mapper: config.mapper,
                    })
                );
            }
        }
    );

    return config.mapper({
        data: config.dataDictionary[config.dataDictionaryKey].data,
        resolvedData,
        schema:
            config.schemaDictionary[
                config.dataDictionary[config.dataDictionaryKey].schemaId
            ],
    });
}
