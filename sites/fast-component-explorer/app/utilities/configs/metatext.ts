import { Metatext, metatextSchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/metatext/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const metatextConfig: ComponentViewConfig = {
    schema: metatextSchema2,
    component: Metatext,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: metatextSchema2.id,
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
                        data: "Metatext",
                    },
                },
                "root",
            ],
        },
    ],
};

export default metatextConfig;
