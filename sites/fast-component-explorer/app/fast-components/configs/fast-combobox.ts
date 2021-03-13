import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/combobox/guidance";
import Scenarios from "../../.tmp/combobox/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastOptionId = "fast-option";
export const fastComboboxId = "fast-combobox";
const fastComboboxConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastComboboxId],
    definition: fastComponentDefinitions[`${camelCase(fastComboboxId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastComboboxConfig;
