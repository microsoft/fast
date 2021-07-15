import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/listbox/guidance";
import Scenarios from "../../.tmp/listbox/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastOptionId = "fast-option";
export const fastListboxId = "fast-listbox";
const fastListboxConfig = {
    schema: fastComponentSchemas[fastListboxId],
    definition: fastComponentDefinitions[`${camelCase(fastListboxId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastListboxConfig;
