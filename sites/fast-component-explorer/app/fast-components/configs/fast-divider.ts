import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/divider/guidance";
import Scenarios from "../../.tmp/divider/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastDividerId = "fast-divider";
const fastDividerConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastDividerId],
    definition: fastComponentDefinitions[`${camelCase(fastDividerId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastDividerConfig;
