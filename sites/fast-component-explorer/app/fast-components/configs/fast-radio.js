import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/radio/guidance";
import Scenarios from "../../.tmp/radio/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastRadioId = "fast-radio";
const fastRadioConfig = {
    schema: fastComponentSchemas[fastRadioId],
    definition: fastComponentDefinitions[`${camelCase(fastRadioId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastRadioConfig;
