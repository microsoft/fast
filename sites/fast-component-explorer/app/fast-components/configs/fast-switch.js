import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/switch/guidance";
import Scenarios from "../../.tmp/switch/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastSwitchId = "fast-switch";
const fastSwitchConfig = {
    schema: fastComponentSchemas[fastSwitchId],
    definition: fastComponentDefinitions[`${camelCase(fastSwitchId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastSwitchConfig;
