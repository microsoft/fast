import {
    ActionToggle,
    ActionToggleAppearance,
    actionToggleSchema2,
} from "@microsoft/fast-components-react-msft";
import { glyphSchema, Icon } from "../../components/glyph";
import Guidance from "../../.tmp/action-toggle/guidance";
import { ComponentViewConfig } from "./data.props";

const actionToggleConfig: ComponentViewConfig = {
    schema: actionToggleSchema2,
    component: ActionToggle,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Neutral",
            dataDictionary: [
                {
                    root: {
                        schemaId: actionToggleSchema2.id,
                        data: {
                            unselectedLabel: "Pause",
                            selectedLabel: "Play",
                            selectedContent: "Pause",
                            unselectedContent: "Play",
                            selectedGlyph: [
                                {
                                    id: "selectedGlyph",
                                },
                            ],
                            unselectedGlyph: [
                                {
                                    id: "unselectedGlyph",
                                },
                            ],
                        },
                    },
                    selectedGlyph: {
                        parent: {
                            id: "root",
                            dataLocation: "selectedGlyph",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.pause,
                        },
                    },
                    unselectedGlyph: {
                        parent: {
                            id: "root",
                            dataLocation: "unselectedGlyph",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.play,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Accent", // using updated "Accent" terminology until "Primary" appearance is deprecated
            dataDictionary: [
                {
                    root: {
                        schemaId: actionToggleSchema2.id,
                        data: {
                            appearance: ActionToggleAppearance.primary,
                            selectedContent: "Pause",
                            unselectedContent: "Play",
                            selectedLabel: "Pause",
                            unselectedLabel: "Play",
                            selectedGlyph: [
                                {
                                    id: "selectedGlyph",
                                },
                            ],
                            unselectedGlyph: [
                                {
                                    id: "unselectedGlyph",
                                },
                            ],
                        },
                    },
                    selectedGlyph: {
                        parent: {
                            id: "root",
                            dataLocation: "selectedGlyph",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.pause,
                        },
                    },
                    unselectedGlyph: {
                        parent: {
                            id: "root",
                            dataLocation: "unselectedGlyph",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.play,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default actionToggleConfig;
