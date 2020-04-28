import { Pivot, pivotSchema2 } from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/pivot/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const pivotConfig: ComponentViewConfig = {
    schema: pivotSchema2,
    component: Pivot,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: pivotSchema2.id,
                        data: {
                            label: "A set of example text content",
                            items: [
                                {
                                    id: uniqueId(),
                                    tab: [
                                        {
                                            id: "tab0",
                                        },
                                    ],
                                    content: [
                                        {
                                            id: "content0",
                                        },
                                    ],
                                },
                                {
                                    id: uniqueId(),
                                    tab: [
                                        {
                                            id: "tab1",
                                        },
                                    ],
                                    content: [
                                        {
                                            id: "content1",
                                        },
                                    ],
                                },
                                {
                                    id: uniqueId(),
                                    tab: [
                                        {
                                            id: "tab2",
                                        },
                                    ],
                                    content: [
                                        {
                                            id: "content2",
                                        },
                                    ],
                                },
                                {
                                    id: uniqueId(),
                                    tab: [
                                        {
                                            id: "tab3",
                                        },
                                    ],
                                    content: [
                                        {
                                            id: "content3",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    tab0: {
                        parent: {
                            id: "root",
                            dataLocation: "items[0].tab",
                        },
                        schemaId: textSchema.id,
                        data: "pivot one",
                    },
                    content0: {
                        parent: {
                            id: "root",
                            dataLocation: "items[0].content",
                        },
                        schemaId: textSchema.id,
                        data: "pivot one content",
                    },
                    tab1: {
                        parent: {
                            id: "root",
                            dataLocation: "items[1].tab",
                        },
                        schemaId: textSchema.id,
                        data: "pivot two",
                    },
                    content1: {
                        parent: {
                            id: "root",
                            dataLocation: "items[1].content",
                        },
                        schemaId: textSchema.id,
                        data: "pivot two content",
                    },
                    tab2: {
                        parent: {
                            id: "root",
                            dataLocation: "items[2].tab",
                        },
                        schemaId: textSchema.id,
                        data: "pivot three",
                    },
                    content2: {
                        parent: {
                            id: "root",
                            dataLocation: "items[2].content",
                        },
                        schemaId: textSchema.id,
                        data: "pivot three content",
                    },
                    tab3: {
                        parent: {
                            id: "root",
                            dataLocation: "items[3].tab",
                        },
                        schemaId: textSchema.id,
                        data: "pivot four",
                    },
                    content3: {
                        parent: {
                            id: "root",
                            dataLocation: "items[3].content",
                        },
                        schemaId: textSchema.id,
                        data: "pivot four content",
                    },
                },
                "root",
            ],
        },
    ],
};

export default pivotConfig;
