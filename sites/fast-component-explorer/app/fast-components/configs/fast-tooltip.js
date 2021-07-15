import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/tooltip/guidance";
import Scenarios from "../../.tmp/tooltip/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastTooltipId = "fast-tooltip";
const fastTooltipConfig = {
    schema: fastComponentSchemas[fastTooltipId],
    definition: fastComponentDefinitions[`${camelCase(fastTooltipId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastTooltipConfig;
