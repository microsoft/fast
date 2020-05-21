import Guidance from "../../.tmp/flipper/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastFlipperId = "fast-flipper";
const fastFlipperConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastFlipperId],
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
