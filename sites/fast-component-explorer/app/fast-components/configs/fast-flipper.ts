import { fastComponentSchemas } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/flipper/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastFlipperId = "fast-flipper";
const fastFlipperConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastFlipperId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastFlipperId,
                        data: {
                            hiddenFromAT: true,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastFlipperConfig;
