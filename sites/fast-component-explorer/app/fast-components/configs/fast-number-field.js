import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/number-field/guidance";
import Scenarios from "../../.tmp/number-field/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastNumberFieldId = "fast-number-field";
const fastNumberFieldConfig = {
    schema: fastComponentSchemas[fastNumberFieldId],
    definition: fastComponentDefinitions[`${camelCase(fastNumberFieldId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastNumberFieldConfig;
