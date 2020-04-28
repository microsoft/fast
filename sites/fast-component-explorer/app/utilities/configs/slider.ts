import {
    Slider,
    sliderLabelSchema2,
    sliderSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/slider/guidance";
import { ComponentViewConfig } from "./data.props";

const sliderConfig: ComponentViewConfig = {
    schema: sliderSchema2,
    component: Slider,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: sliderSchema2.id,
                        data: {},
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Min and max",
            dataDictionary: [
                {
                    root: {
                        schemaId: sliderSchema2.id,
                        data: {
                            range: {
                                minValue: 0,
                                maxValue: 100,
                            },
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "With indicators",
            dataDictionary: [
                {
                    root: {
                        schemaId: sliderSchema2.id,
                        data: {
                            range: {
                                minValue: 0,
                                maxValue: 100,
                            },
                            children: [
                                {
                                    id: "children0",
                                },
                                {
                                    id: "children1",
                                },
                                {
                                    id: "children2",
                                },
                                {
                                    id: "children3",
                                },
                                {
                                    id: "children4",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: sliderLabelSchema2.id,
                        data: {
                            valuePositionBinding: 0,
                            label: "low",
                        },
                    },
                    children1: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: sliderLabelSchema2.id,
                        data: {
                            valuePositionBinding: 25,
                            label: "25",
                        },
                    },
                    children2: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: sliderLabelSchema2.id,
                        data: {
                            valuePositionBinding: 50,
                            label: "50",
                        },
                    },
                    children3: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: sliderLabelSchema2.id,
                        data: {
                            valuePositionBinding: 75,
                            label: "75",
                        },
                    },
                    children4: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: sliderLabelSchema2.id,
                        data: {
                            valuePositionBinding: 100,
                            label: "high",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default sliderConfig;
