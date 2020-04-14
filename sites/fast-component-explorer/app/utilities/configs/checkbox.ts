import {
    Checkbox,
    CheckboxProps,
    checkboxSchema,
    labelSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/checkbox/guidance";
import { ComponentViewConfig } from "./data.props";

const id: string = uniqueId();

const checkboxConfig: ComponentViewConfig<CheckboxProps> = {
    schema: checkboxSchema,
    component: Checkbox,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                inputId: id,
                children: [
                    {
                        id: labelSchema.id,
                        props: {
                            slot: "label",
                            htmlFor: id,
                            children: "Checkbox",
                        },
                    },
                ],
            },
        },
    ],
};

export default checkboxConfig;
