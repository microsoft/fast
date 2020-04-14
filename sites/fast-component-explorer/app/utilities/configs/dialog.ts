import { Dialog, DialogProps, dialogSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/dialog/guidance";
import { ComponentViewConfig } from "./data.props";

const dialogConfig: ComponentViewConfig<DialogProps> = {
    schema: dialogSchema,
    component: Dialog,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                visible: true,
            },
        },
        {
            displayName: "Modal",
            data: {
                visible: true,
                modal: true,
            },
        },
    ],
};

export default dialogConfig;
