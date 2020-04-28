import {
    Checkbox,
    checkboxSchema2,
    labelSchema2,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/checkbox/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const id: string = uniqueId();

const checkboxConfig: ComponentViewConfig = {
    schema: checkboxSchema2,
    component: Checkbox,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: checkboxSchema2.id,
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
                                    id: "text",
                                },
                            ],
                        },
                    },
                    text: {
                        parent: {
                            id: "children",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Checkbox",
                    },
                },
                "root",
            ],
        },
    ],
};

export default checkboxConfig;
