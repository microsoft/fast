import {
    Heading,
    headingSchema2,
    HeadingSize,
    HeadingTag,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/heading/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const headingConfig: ComponentViewConfig = {
    schema: headingSchema2,
    component: Heading,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Heading 1",
            dataDictionary: [
                {
                    root: {
                        schemaId: headingSchema2.id,
                        data: {
                            tag: HeadingTag.h1,
                            size: HeadingSize._1,
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
                        data: "Heading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Heading 2",
            dataDictionary: [
                {
                    root: {
                        schemaId: headingSchema2.id,
                        data: {
                            tag: HeadingTag.h2,
                            size: HeadingSize._2,
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
                        data: "Heading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Heading 3",
            dataDictionary: [
                {
                    root: {
                        schemaId: headingSchema2.id,
                        data: {
                            tag: HeadingTag.h3,
                            size: HeadingSize._3,
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
                        data: "Heading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Heading 4",
            dataDictionary: [
                {
                    root: {
                        schemaId: headingSchema2.id,
                        data: {
                            tag: HeadingTag.h4,
                            size: HeadingSize._4,
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
                        data: "Heading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Heading 5",
            dataDictionary: [
                {
                    root: {
                        schemaId: headingSchema2.id,
                        data: {
                            tag: HeadingTag.h5,
                            size: HeadingSize._5,
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
                        data: "Heading",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Heading 6",
            dataDictionary: [
                {
                    root: {
                        schemaId: headingSchema2.id,
                        data: {
                            tag: HeadingTag.h6,
                            size: HeadingSize._6,
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
                        data: "Heading",
                    },
                },
                "root",
            ],
        },
    ],
};

export default headingConfig;
