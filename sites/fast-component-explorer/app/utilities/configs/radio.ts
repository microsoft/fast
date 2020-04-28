import { labelSchema2, Radio, radioSchema2 } from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/radio/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const id: string = uniqueId();

const radioConfig: ComponentViewConfig = {
    schema: radioSchema2,
    component: Radio,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: radioSchema2.id,
                        data: {
                            inputId: id,
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
                        schemaId: labelSchema2.id,
                        data: {
                            slot: "label",
                            htmlFor: id,
                            children: [
                                {
                                    id: "label",
                                },
                            ],
                        },
                    },
                    label: {
                        parent: {
                            id: "children",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Radio",
                    },
                },
                "root",
            ],
        },
    ],
};

export default radioConfig;
