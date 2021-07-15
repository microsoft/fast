import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/text-field/guidance";
import Scenarios from "../../.tmp/text-field/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastTextFieldId = "fast-text-field";
const fastTextFieldConfig = {
    schema: fastComponentSchemas[fastTextFieldId],
    definition: fastComponentDefinitions[`${camelCase(fastTextFieldId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastTextFieldConfig;
