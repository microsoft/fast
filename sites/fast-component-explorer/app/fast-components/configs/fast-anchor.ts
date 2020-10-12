import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { mapScenarios } from "../utilities/mapping";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/anchor/guidance";
import Scenarios from "../../.tmp/anchor/scenario";
import { ComponentViewConfig } from "./data.props";

export const fastAnchorId = "fast-anchor";
const fastAnchorConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastAnchorId],
    definition: fastComponentDefinitions[`${camelCase(fastAnchorId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastAnchorConfig;
