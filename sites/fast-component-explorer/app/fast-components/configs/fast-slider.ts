import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/slider/guidance";
import Scenarios from "../../.tmp/slider/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastSliderId = "fast-slider";
export const fastSliderLabelId = "fast-slider-label";
const fastSliderConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastSliderId],
    definition: fastComponentDefinitions[`${camelCase(fastSliderId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastSliderConfig;
