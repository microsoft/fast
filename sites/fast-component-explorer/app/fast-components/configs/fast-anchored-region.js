import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import { mapScenarios } from "../utilities/mapping";
import Guidance from "../../.tmp/anchored-region/guidance";
import Scenarios from "../../.tmp/anchored-region/scenario";
export const fastAnchoredRegionId = "fast-anchored-region";
const fastAnchoredRegionConfig = {
    schema: fastComponentSchemas[fastAnchoredRegionId],
    definition: fastComponentDefinitions[`${camelCase(fastAnchoredRegionId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastAnchoredRegionConfig;
