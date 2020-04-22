import {
    Breadcrumb,
    breadcrumbSchema2,
    hypertextSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/breadcrumb/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const breadcrumbConfig: ComponentViewConfig = {
    schema: breadcrumbSchema2,
    component: Breadcrumb,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: breadcrumbSchema2.id,
                        data: {
                            label: "",
                            separator: [
                                {
                                    id: "separator",
                                },
                            ],
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
                            ],
                        },
                    },
                    separator: {
                        parent: {
                            id: "root",
                            dataLocation: "separator",
                        },
                        schemaId: textSchema.id,
                        data: "/",
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: hypertextSchema2.id,
                        data: {
                            href: "https://www.microsoft.com/en-us/",
                            children: [
                                {
                                    id: "children00",
                                },
                            ],
                        },
                    },
                    children00: {
                        parent: {
                            id: "children0",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "breadcrumb item 1",
                    },
                    children1: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: hypertextSchema2.id,
                        data: {
                            href: "https://www.microsoft.com/en-us/",
                            children: [
                                {
                                    id: "children10",
                                },
                            ],
                        },
                    },
                    children10: {
                        parent: {
                            id: "children1",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "breadcrumb item 2",
                    },
                    children2: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: hypertextSchema2.id,
                        data: {
                            href: "https://www.microsoft.com/en-us/",
                            children: [
                                {
                                    id: "children20",
                                },
                            ],
                        },
                    },
                    children20: {
                        parent: {
                            id: "children2",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "breadcrumb item 3",
                    },
                },
                "root",
            ],
        },
    ],
};

export default breadcrumbConfig;
