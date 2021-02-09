import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/button/guidance";
import Scenarios from "../../.tmp/button/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastButtonId = "fast-button";

const fastButtonConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastButtonId],
    definition: fastComponentDefinitions[`${camelCase(fastButtonId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastButtonConfig;
