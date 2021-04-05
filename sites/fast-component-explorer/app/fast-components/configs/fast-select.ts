import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/select/guidance";
import Scenarios from "../../.tmp/select/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastOptionId = "fast-option";
export const fastSelectId = "fast-select";
const fastSelectConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastSelectId],
    definition: fastComponentDefinitions[`${camelCase(fastSelectId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastSelectConfig;
