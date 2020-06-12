import { fastComponentSchemas, textSchema } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/slider/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastSliderId = "fast-slider";
export const fastSliderLabelId = "fast-slider-label";
const fastSliderConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastSliderId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastSliderId,
                        data: {},
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Vertical with labels",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastSliderId,
                        data: {
                            min: 0,
                            max: 100,
                            step: 10,
                            value: 70,
                            orientation: "vertical",
                            Slot: [
                                {
                                    id: "Slot0",
                                },
                                {
                                    id: "Slot1",
                                },
                                {
                                    id: "Slot2",
                                },
                                {
                                    id: "Slot3",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastSliderLabelId,
                        data: {
                            position: "0",
                            Slot: [
                                {
                                    id: "Slot01",
                                },
                            ],
                        },
                    },
                    Slot01: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "0%",
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastSliderLabelId,
                        data: {
                            position: "10",
                            Slot: [
                                {
                                    id: "Slot11",
                                },
                            ],
                        },
                    },
                    Slot11: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "10%",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastSliderLabelId,
                        data: {
                            position: "90",
                            Slot: [
                                {
                                    id: "Slot21",
                                },
                            ],
                        },
                    },
                    Slot21: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "90%",
                    },
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastSliderLabelId,
                        data: {
                            position: "100",
                            Slot: [
                                {
                                    id: "Slot31",
                                },
                            ],
                        },
                    },
                    Slot31: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "100%",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Orientation with labels",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastSliderId,
                        data: {
                            min: 0,
                            max: 100,
                            step: 10,
                            value: 70,
                            Slot: [
                                {
                                    id: "Slot0",
                                },
                                {
                                    id: "Slot1",
                                },
                                {
                                    id: "Slot2",
                                },
                                {
                                    id: "Slot3",
                                },
                            ],
                        },
                    },
                    Slot0: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastSliderLabelId,
                        data: {
                            position: "0",
                            Slot: [
                                {
                                    id: "Slot01",
                                },
                            ],
                        },
                    },
                    Slot01: {
                        parent: {
                            id: "Slot0",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "0%",
                    },
                    Slot1: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastSliderLabelId,
                        data: {
                            position: "10",
                            Slot: [
                                {
                                    id: "Slot11",
                                },
                            ],
                        },
                    },
                    Slot11: {
                        parent: {
                            id: "Slot1",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "10%",
                    },
                    Slot2: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastSliderLabelId,
                        data: {
                            position: "90",
                            Slot: [
                                {
                                    id: "Slot21",
                                },
                            ],
                        },
                    },
                    Slot21: {
                        parent: {
                            id: "Slot2",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "90%",
                    },
                    Slot3: {
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        schemaId: fastSliderLabelId,
                        data: {
                            position: "100",
                            Slot: [
                                {
                                    id: "Slot31",
                                },
                            ],
                        },
                    },
                    Slot31: {
                        parent: {
                            id: "Slot3",
                            dataLocation: "Slot",
                        },
                        schemaId: textSchema.id,
                        data: "100%",
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastSliderConfig;
