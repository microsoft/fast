import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import { mapScenarios } from "../utilities/mapping";
import Guidance from "../../.tmp/avatar/guidance";
import Scenarios from "../../.tmp/avatar/scenario";
import { ComponentViewConfig } from "./data.props";

export const fastAvatarId = "fast-avatar";
const fastAvatarConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastAvatarId],
    definition: fastComponentDefinitions[`${camelCase(fastAvatarId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};

export default fastAvatarConfig;
