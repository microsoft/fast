import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import { mapScenarios } from "../utilities/mapping";
import Guidance from "../../.tmp/breadcrumb/guidance";
import Scenarios from "../../.tmp/breadcrumb/scenario";
export const fastBreadcrumbId = "fast-breadcrumb";
export const fastBreadcrumbItemId = "fast-breadcrumb-item";
const fastBreadcrumbConfig = {
    schema: fastComponentSchemas[fastBreadcrumbId],
    definition: fastComponentDefinitions[`${camelCase(fastBreadcrumbId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastBreadcrumbConfig;
