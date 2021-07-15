import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/text-area/guidance";
import Scenarios from "../../.tmp/text-area/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastTextAreaId = "fast-text-area";
const fastTextAreaConfig = {
    schema: fastComponentSchemas[fastTextAreaId],
    definition: fastComponentDefinitions[`${camelCase(fastTextAreaId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastTextAreaConfig;
