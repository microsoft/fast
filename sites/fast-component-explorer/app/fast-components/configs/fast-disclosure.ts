import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/disclosure/guidance";
import Scenarios from "../../.tmp/disclosure/scenario";
import { mapScenarios } from "../utilities/mapping";
import { ComponentViewConfig } from "./data.props";

export const fastDisclosureId = "fast-disclosure";

const fastDisclosureConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastDisclosureId],
    definition: fastComponentDefinitions[`${camelCase(fastDisclosureId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastDisclosureConfig;
