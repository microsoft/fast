import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/picker/guidance";
import Scenarios from "../../.tmp/picker/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastPickerId = "fast-picker";
export const fastPickerListId = "fast-picker-list";
export const fastPickerMenuId = "fast-picker-menu";
export const fastPickerListItemId = "fast-picker-list-item";
export const fastPickerMenuOptionId = "fast-picker-menu-option";

const fastPickerConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastPickerId],
    definition: fastComponentDefinitions[`${camelCase(fastPickerId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastPickerConfig;
