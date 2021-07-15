import { ElementDictionary, MapperConfig } from "@microsoft/fast-tooling";
export declare const dataSetDictionaryId = "data-creator-wrapper-dictionary-id";
/**
 * This wrapper is similar to the htmlMapper found in @microsoft/fast-tooling
 * however it also sets a dataset attribute to allow the current
 * active component to be highlighted
 */
export declare function htmlMapper(
    elementDictionary: ElementDictionary
): (config: MapperConfig<string>) => void;
