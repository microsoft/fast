import { WebComponentDefinition } from "../data-utilities/web-component";
import * as nativeElementDefinitions from "./native";
export declare function extendElementDefinitions(definitions: {
    [key: string]: WebComponentDefinition;
}): {
    [key: string]: WebComponentDefinition;
};
declare const nativeElementExtendedDefinitions: {
    [key: string]: WebComponentDefinition;
};
export { nativeElementDefinitions, nativeElementExtendedDefinitions };
