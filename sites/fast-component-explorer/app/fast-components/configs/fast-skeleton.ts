import {
    fastComponentDefinitions,
    fastComponentSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import { camelCase } from "lodash-es";
import Guidance from "../../.tmp/skeleton/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastSkeletonId = "fast-skeleton";
const fastSkeletonConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastSkeletonId],
    definition: fastComponentDefinitions[`${camelCase(fastSkeletonId)}Definition`],
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
                                    id: "div",
                                },
                                {
                                    id: "style",
                                },
                            ],
                        },
                    },
                    div: {
                        schemaId: "div",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {
                            class: "card-placeholder",
                            Slot: [
                                {
                                    id: "skeleton1",
                                },
                                {
                                    id: "skeleton2",
                                },
                                {
                                    id: "skeleton3",
                                },
                                {
                                    id: "skeleton4",
                                },
                                {
                                    id: "skeleton5",
                                },
                            ],
                        },
                    },
                    style: {
                        schemaId: "style",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {
                            Slot: [
                                {
                                    id: "styleText",
                                },
                            ],
                        },
                    },
                    styleText: {
                        schemaId: textSchema.id,
                        parent: {
                            id: "style",
                            dataLocation: "Slot",
                        },
                        data:
                            ".card-placeholder { background-color: #fff; padding: 20px; width: 500px; border-radius: 4px; }",
                    },
                    skeleton1: {
                        schemaId: fastSkeletonId,
                        parent: {
                            id: "div",
                            dataLocation: "Slot",
                        },
                        data: {
                            style: "border-radius: 4px; width: 50px; height: 50px;",
                            shape: "circle",
                        },
                    },
                    skeleton2: {
                        schemaId: fastSkeletonId,
                        parent: {
                            id: "div",
                            dataLocation: "Slot",
                        },
                        data: {
                            style: "border-radius: 4px; margin-top: 10px; height: 10px;",
                            shape: "rect",
                        },
                    },
                    skeleton3: {
                        schemaId: fastSkeletonId,
                        parent: {
                            id: "div",
                            dataLocation: "Slot",
                        },
                        data: {
                            style: "border-radius: 4px; margin-top: 10px; height: 10px;",
                            shape: "rect",
                        },
                    },
                    skeleton4: {
                        schemaId: fastSkeletonId,
                        parent: {
                            id: "div",
                            dataLocation: "Slot",
                        },
                        data: {
                            style: "border-radius: 4px; margin-top: 10px; height: 10px;",
                            shape: "rect",
                        },
                    },
                    skeleton5: {
                        schemaId: fastSkeletonId,
                        parent: {
                            id: "div",
                            dataLocation: "Slot",
                        },
                        data: {
                            style:
                                "border-radius: 4px; width: 75px; height: 30px; margin-top: 20px; margin-bottom: 10px;",
                            shape: "rect",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastSkeletonConfig;
