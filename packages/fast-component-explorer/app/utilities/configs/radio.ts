import { ComponentViewConfig } from "./data.props";
import {
    labelSchema,
    Radio,
    RadioProps,
    radioSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/radio/guidance";
import API from "../../.tmp/radio/api";

const id: string = uniqueId();

const radioConfig: ComponentViewConfig<RadioProps> = {
    api: API,
    schema: radioSchema,
    component: Radio,
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
                            children: "Radio",
                        },
                    },
                ],
            },
        },
    ],
};

export default radioConfig;
