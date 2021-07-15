import {
    extendElementDefinitions,
    nativeElementDefinitions,
    nativeElementExtendedDefinitions,
} from "@microsoft/fast-tooling/dist/esm/definitions";
import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import * as fluentUIComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions"; // TODO:

const fastComponentExtendedDefinitions = extendElementDefinitions(
    fastComponentDefinitions
);

const fluentUIComponentExtendedDefinitions = extendElementDefinitions(
    fluentUIComponentDefinitions
);

export {
    fastComponentDefinitions,
    fluentUIComponentDefinitions,
    nativeElementDefinitions,
    fastComponentExtendedDefinitions,
    fluentUIComponentExtendedDefinitions,
    nativeElementExtendedDefinitions,
};
