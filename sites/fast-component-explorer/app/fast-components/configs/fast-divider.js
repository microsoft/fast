import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/divider/guidance";
import Scenarios from "../../.tmp/divider/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastDividerId = "fast-divider";
const fastDividerConfig = {
    schema: fastComponentSchemas[fastDividerId],
    definition: fastComponentDefinitions[`${camelCase(fastDividerId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastDividerConfig;
