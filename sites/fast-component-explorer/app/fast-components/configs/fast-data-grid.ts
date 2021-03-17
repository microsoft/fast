import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/data-grid/guidance";
import Scenarios from "../../.tmp/data-grid/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastDataGridId = "fast-data-grid";
export const fastDataGridCellId = "fast-data-grid-cell";
export const fastDataGridRowId = "fast-data-grid-row";

const fastDataGridConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastDataGridId],
    definition: fastComponentDefinitions[`${camelCase(fastDataGridId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastDataGridConfig;
