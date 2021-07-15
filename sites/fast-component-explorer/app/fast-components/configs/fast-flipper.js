import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/flipper/guidance";
import Scenarios from "../../.tmp/flipper/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastFlipperId = "fast-flipper";
const fastFlipperConfig = {
    schema: fastComponentSchemas[fastFlipperId],
    definition: fastComponentDefinitions[`${camelCase(fastFlipperId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastFlipperConfig;
