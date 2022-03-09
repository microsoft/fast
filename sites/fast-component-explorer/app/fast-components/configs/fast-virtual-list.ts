import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/virtual-list/guidance";
import Scenarios from "../../.tmp/virtual-list/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastVirtualListItemId = "fast-virtual-list";
export const fastVirtualListId = "fast-virtual-list";
const fastVirtualListConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastVirtualListId],
    definition: fastComponentDefinitions[`${camelCase(fastVirtualListId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastVirtualListConfig;
