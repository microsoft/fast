import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import { mapScenarios } from "../utilities/mapping";

import Guidance from "../../.tmp/accordion/guidance";
import Scenarios from "../../.tmp/accordion/scenario";
import { ComponentViewConfig } from "./data.props";

export const fastAccordionId = "fast-accordion";
export const fastAccordionItemId = "fast-accordion-item";
export const fastCheckboxId = "fast-checkbox";
export const fastButtonId = "fast-button";

const fastAccordionConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastAccordionId],
    definition: fastComponentDefinitions[`${camelCase(fastAccordionId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastAccordionConfig;
