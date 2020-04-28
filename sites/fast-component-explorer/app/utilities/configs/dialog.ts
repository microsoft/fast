import { Dialog, dialogSchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/dialog/guidance";
import { ComponentViewConfig } from "./data.props";

const dialogConfig: ComponentViewConfig = {
    schema: dialogSchema2,
    component: Dialog,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: dialogSchema2.id,
                        data: {
                            visible: true,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Modal",
            dataDictionary: [
                {
                    root: {
                        schemaId: dialogSchema2.id,
                        data: {
                            visible: true,
                            modal: true,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default dialogConfig;
