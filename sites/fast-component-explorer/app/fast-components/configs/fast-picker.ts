import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/progress/guidance";
import Scenarios from "../../.tmp/progress/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastPickerId = "fast-picker";
const fastPickerConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastPickerId],
    definition: fastComponentDefinitions[`${camelCase(fastPickerId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastPickerConfig;
