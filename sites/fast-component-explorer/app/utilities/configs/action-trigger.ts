import {
    ActionTrigger,
    actionTriggerSchema2,
} from "@microsoft/fast-components-react-msft";
import textSchema from "../../msft-component-helpers/text.schema";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import Guidance from "../../.tmp/action-trigger/guidance";
import { ComponentViewConfig } from "./data.props";

const actionTriggerConfig: ComponentViewConfig = {
    schema: actionTriggerSchema2,
    component: ActionTrigger,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Neutral",
            dataDictionary: [
                {
                    root: {
                        schemaId: actionTriggerSchema2.id,
                        data: {
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                            glyph: [
                                {
                                    id: "glyph",
                                },
                            ],
                        },
                    },
                    glyph: {
                        parent: {
                            id: "root",
                            dataLocation: "glyph",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.download,
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Download",
                    },
                },
                "root",
            ],
        },
    ],
};

export default actionTriggerConfig;
