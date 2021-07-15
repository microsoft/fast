import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/checkbox/guidance";
import Scenarios from "../../.tmp/checkbox/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastCheckboxId = "fast-checkbox";
const fastCheckboxConfig = {
    schema: fastComponentSchemas[fastCheckboxId],
    definition: fastComponentDefinitions[`${camelCase(fastCheckboxId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastCheckboxConfig;
