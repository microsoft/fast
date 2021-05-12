import {
    extendElementDefinitions,
    nativeElementDefinitions,
    nativeElementExtendedDefinitions,
} from "@microsoft/fast-tooling/dist/esm/definitions";
import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";

const fastComponentExtendedDefinitions = extendElementDefinitions(
    fastComponentDefinitions
);

export {
    fastComponentDefinitions,
    nativeElementDefinitions,
    fastComponentExtendedDefinitions,
    nativeElementExtendedDefinitions,
};
