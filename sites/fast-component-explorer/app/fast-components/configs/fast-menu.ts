import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/menu/guidance";
import Scenarios from "../../.tmp/menu/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastMenuId = "fast-menu";
export const fastMenuItemId = "fast-menu-item";
export const fastDividerId = "fast-divider";
const fastMenuConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastMenuId],
    definition: fastComponentDefinitions[`${camelCase(fastMenuId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastMenuConfig;
