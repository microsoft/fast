import textSchema from "../../utilities/text.schema";
import Guidance from "../../.tmp/dialog/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastDialogId = "fast-dialog";
const fastDialogConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastDialogId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastDialogId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot",
                                },
                            ],
                        },
                    },
                    Slot: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Dialog",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastDialogConfig;
