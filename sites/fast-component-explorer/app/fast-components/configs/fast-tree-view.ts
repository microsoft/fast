import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/tree-view/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastTreeItemId = "fast-tree-item";
export const fastTreeViewId = "fast-tree-view";
const fastTreeViewConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastTreeViewId],
    definition: fastComponentDefinitions[`${camelCase(fastTreeViewId)}Definition`],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastTreeViewId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot0",
                                },
                                {
                                    id: "Slot1",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastTreeItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot00",
                                },
                                {
                                    id: "Slot01",
                                },
                            ],
                        },
                    },
                    Slot00: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Tree item 1",
                    },
                    Slot01: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "Slot",
                        },
                        schemaId: fastTreeItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot010",
                                },
                            ],
                        },
                    },
                    Slot010: {
                        parent: {
                            id: "Slot01",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Tree item 1 - 1",
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastTreeItemId,
                        data: {
                            Slot: [
                                {
                                    id: "Slot10",
                                },
                            ],
                        },
                    },
                    Slot10: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "Tree item 2",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastTreeViewConfig;
