import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/toolbar/guidance";
import Scenarios from "../../.tmp/toolbar/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastToolbarId = "fast-toolbar";
const fastToolbarConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastToolbarId],
    definition: fastComponentDefinitions[`${camelCase(fastToolbarId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastToolbarConfig;
