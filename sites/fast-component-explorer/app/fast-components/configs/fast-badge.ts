import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
    nativeElementExtendedSchemas,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/badge/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastBadgeId = "fast-badge";
const fastBadgeConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastBadgeId],
    definition: fastComponentDefinitions[`${camelCase(fastBadgeId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            Slot: [
                                {
                                    id: "style",
                                },
                                {
                                    id: "badge",
                                },
                            ],
                        },
                    },
                    style: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: "style",
                        data: {
                            Slot: [
                                {
                                    id: "styleContent",
                                },
                            ],
                        },
                    },
                    styleContent: {
                        parent: {
                            id: "style",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: `
                        /* For example purposes only. App authors needs to define */

                        fast-badge {
                            --badge-fill-primary: rgba(255, 0, 0, 1);
                            --badge-fill-secondary: #00FF00;
                            --badge-fill-transparent: transparent;
                            --badge-color-black: #000000;
                            --badge-color-white: #FFFFFF;
                         }`,
                    },
                    badge: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastBadgeId,
                        data: {
                            fill: "primary",
                            color: "white",
                            Slot: [
                                {
                                    id: "Slot",
                                },
                            ],
                        },
                    },
                    Slot: {
                        parent: {
                            id: "badge",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Badge",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastBadgeConfig;
