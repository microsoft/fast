import { ComponentViewConfig } from "./data.props";
import {
    ActionToggle,
    ActionToggleAppearance,
    ActionToggleProps,
    actionToggleSchema,
} from "@microsoft/fast-components-react-msft";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import Guidance from "../../.tmp/action-toggle/guidance";
import API from "../../.tmp/action-toggle/api";

const actionToggleConfig: ComponentViewConfig<ActionToggleProps> = {
    api: API,
    schema: actionToggleSchema,
    component: ActionToggle,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Neutral",
            data: {
                unselectedLabel: "Pause",
                selectedLabel: "Play",
                selectedContent: "Pause",
                unselectedContent: "Play",
                selectedGlyph: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.pause,
                    },
                } as any,
                unselectedGlyph: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.play,
                    },
                } as any,
            },
        },
        {
            displayName: "Accent", // using updated "Accent" terminology until "Primary" appearance is deprecated
            data: {
                appearance: ActionToggleAppearance.primary,
                selectedContent: "Pause",
                unselectedContent: "Play",
                selectedLabel: "Pause",
                unselectedLabel: "Play",
                selectedGlyph: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.pause,
                    },
                } as any,
                unselectedGlyph: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.play,
                    },
                } as any,
            },
        },
    ],
};

export default actionToggleConfig;
