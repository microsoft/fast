import {
    fastComponentDefinitions,
    fastComponentSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/dialog/guidance";
import Scenarios from "../../.tmp/dialog/scenario";
import { mapScenarios } from "../utilities/mapping";
export const fastDialogId = "fast-dialog";
const fastDialogConfig = {
    schema: fastComponentSchemas[fastDialogId],
    definition: fastComponentDefinitions[`${camelCase(fastDialogId)}Definition`],
    guidance: Guidance,
    scenarios: mapScenarios(Scenarios),
};
export default fastDialogConfig;
