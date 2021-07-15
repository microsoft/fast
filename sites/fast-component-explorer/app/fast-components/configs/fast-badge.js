import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import { mapScenarios } from "../utilities/mapping";
import Guidance from "../../.tmp/badge/guidance";
import Scenarios from "../../.tmp/badge/scenario";
export const fastBadgeId = "fast-badge";
const fastBadgeConfig = {
    schema: fastComponentSchemas[fastBadgeId],
    definition: fastComponentDefinitions[`${camelCase(fastBadgeId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastBadgeConfig;
