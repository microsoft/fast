import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/tabs/guidance";
import Scenarios from "../../.tmp/tabs/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastTabsId = "fast-tabs";
export const fastTabId = "fast-tab";
export const fastTabPanelId = "fast-tab-panel";
export const fastButtonId = "fast-button";

const fastTabsConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastTabsId],
    definition: fastComponentDefinitions[`${camelCase(fastTabsId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastTabsConfig;
