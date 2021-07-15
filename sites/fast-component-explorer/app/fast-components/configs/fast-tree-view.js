import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/tree-view/guidance";
import Scenarios from "../../.tmp/tree-view/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastTreeItemId = "fast-tree-item";
export const fastTreeViewId = "fast-tree-view";
const fastTreeViewConfig = {
    schema: fastComponentSchemas[fastTreeViewId],
    definition: fastComponentDefinitions[`${camelCase(fastTreeViewId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastTreeViewConfig;
