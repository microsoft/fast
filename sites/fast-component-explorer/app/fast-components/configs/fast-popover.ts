import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/popover/guidance";
import Scenarios from "../../.tmp/popover/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastPopoverId = "fast-popover";
const fastPopoverConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastPopoverId],
    definition: fastComponentDefinitions[`${camelCase(fastPopoverId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastPopoverConfig;
