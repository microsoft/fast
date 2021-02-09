import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/progress/guidance";
import Scenarios from "../../.tmp/progress/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastProgressId = "fast-progress";
const fastProgressConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastProgressId],
    definition: fastComponentDefinitions[`${camelCase(fastProgressId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastProgressConfig;
