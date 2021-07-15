import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/card/guidance";
import Scenarios from "../../.tmp/card/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastCardId = "fast-card";
const fastCardConfig = {
    schema: fastComponentSchemas[fastCardId],
    definition: fastComponentDefinitions[`${camelCase(fastCardId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastCardConfig;
