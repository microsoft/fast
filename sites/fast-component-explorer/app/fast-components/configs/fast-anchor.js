import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import { mapScenarios } from "../utilities/mapping";
import Guidance from "../../.tmp/anchor/guidance";
import Scenarios from "../../.tmp/anchor/scenario";
export const fastAnchorId = "fast-anchor";
const fastAnchorConfig = {
    schema: fastComponentSchemas[fastAnchorId],
    definition: fastComponentDefinitions[`${camelCase(fastAnchorId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastAnchorConfig;
