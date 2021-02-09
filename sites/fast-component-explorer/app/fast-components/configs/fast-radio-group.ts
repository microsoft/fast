import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/radio-group/guidance";
import Scenarios from "../../.tmp/radio-group/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastRadioGroupId = "fast-radio-group";
const fastRadioGroupConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastRadioGroupId],
    definition: fastComponentDefinitions[`${camelCase(fastRadioGroupId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastRadioGroupConfig;
