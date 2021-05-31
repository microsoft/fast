import {
    extendElementDefinitions,
    nativeElementDefinitions,
    nativeElementExtendedDefinitions,
} from "@microsoft/fast-tooling/dist/esm/definitions";
import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import fluentComponentDefinitions from "./fluent-component-definitions";

const fastComponentExtendedDefinitions = extendElementDefinitions(
    fastComponentDefinitions
);

const fluentComponentExtendedDefinitions = extendElementDefinitions(
    fluentComponentDefinitions
);

export {
    fastComponentDefinitions,
    fluentComponentDefinitions,
    nativeElementDefinitions,
    fastComponentExtendedDefinitions,
    fluentComponentExtendedDefinitions,
    nativeElementExtendedDefinitions,
};
