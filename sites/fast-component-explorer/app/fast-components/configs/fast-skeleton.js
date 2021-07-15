import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/skeleton/guidance";
import Scenarios from "../../.tmp/skeleton/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastSkeletonId = "fast-skeleton";
const fastSkeletonConfig = {
    schema: fastComponentSchemas[fastSkeletonId],
    definition: fastComponentDefinitions[`${camelCase(fastSkeletonId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastSkeletonConfig;
