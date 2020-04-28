import { Hypertext, hypertextSchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/hypertext/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const hypertextConfig: ComponentViewConfig = {
    schema: hypertextSchema2,
    component: Hypertext,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: hypertextSchema2.id,
                        data: {
                            href: "#",
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
                        data: "Hypertext",
                    },
                },
                "root",
            ],
        },
    ],
};

export default hypertextConfig;
