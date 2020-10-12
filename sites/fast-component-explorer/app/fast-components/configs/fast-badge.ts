import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { mapScenarios } from "../utilities/mapping";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/badge/guidance";
import Scenarios from "../../.tmp/badge/scenario";
import { ComponentViewConfig } from "./data.props";

export const fastBadgeId = "fast-badge";
const fastBadgeConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastBadgeId],
    definition: fastComponentDefinitions[`${camelCase(fastBadgeId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastBadgeConfig;
