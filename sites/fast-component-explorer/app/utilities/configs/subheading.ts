import {
    Subheading,
    subheadingSchema2,
    SubheadingSize,
    SubheadingTag,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/subheading/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const subheadingConfig: ComponentViewConfig = {
    schema: subheadingSchema2,
    component: Subheading,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Subheading 1",
            dataDictionary: [
                {
                    root: {
                        schemaId: subheadingSchema2.id,
                        data: {
                            tag: SubheadingTag.h1,
                            size: SubheadingSize._1,
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Subheading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Subheading 2",
            dataDictionary: [
                {
                    root: {
                        schemaId: subheadingSchema2.id,
                        data: {
                            tag: SubheadingTag.h2,
                            size: SubheadingSize._2,
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Subheading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Subheading 3",
            dataDictionary: [
                {
                    root: {
                        schemaId: subheadingSchema2.id,
                        data: {
                            tag: SubheadingTag.h3,
                            size: SubheadingSize._3,
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Subheading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Subheading 4",
            dataDictionary: [
                {
                    root: {
                        schemaId: subheadingSchema2.id,
                        data: {
                            tag: SubheadingTag.h4,
                            size: SubheadingSize._4,
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Subheading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Subheading 5",
            dataDictionary: [
                {
                    root: {
                        schemaId: subheadingSchema2.id,
                        data: {
                            tag: SubheadingTag.h5,
                            size: SubheadingSize._5,
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Subheading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Subheading 6",
            dataDictionary: [
                {
                    root: {
                        schemaId: subheadingSchema2.id,
                        data: {
                            tag: SubheadingTag.h6,
                            size: SubheadingSize._6,
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Subheading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Subheading p",
            dataDictionary: [
                {
                    root: {
                        schemaId: subheadingSchema2.id,
                        data: {
                            tag: SubheadingTag.p,
                            children: [
                                {
                                    id: "children",
                                },
                            ],
                        },
                    },
                    children: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Subheading",
                    },
                },
                "root",
            ],
        },
    ],
};

export default subheadingConfig;
