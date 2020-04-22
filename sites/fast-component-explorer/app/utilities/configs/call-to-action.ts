import { CallToAction, callToActionSchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/call-to-action/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const callToActionConfig: ComponentViewConfig = {
    schema: callToActionSchema2,
    component: CallToAction,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Neutral",
            dataDictionary: [
                {
                    root: {
                        schemaId: callToActionSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Buy Now",
                    },
                },
                "root",
            ],
        },
    ],
};

export default callToActionConfig;
