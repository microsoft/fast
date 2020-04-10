import {
    ActionTrigger,
    ActionTriggerProps,
    actionTriggerSchema,
} from "@microsoft/fast-components-react-msft";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import Guidance from "../../.tmp/action-trigger/guidance";
import { ComponentViewConfig } from "./data.props";

const actionTriggerConfig: ComponentViewConfig<ActionTriggerProps> = {
    schema: actionTriggerSchema,
    component: ActionTrigger,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Neutral",
            data: {
                glyph: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.download,
                    },
                } as any,
                children: "Download",
            },
        },
    ],
};

export default actionTriggerConfig;
