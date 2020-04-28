import {
    Paragraph,
    paragraphSchema2,
    ParagraphSize,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/paragraph/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const paragraphConfig: ComponentViewConfig = {
    schema: paragraphSchema2,
    component: Paragraph,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Paragraph 1",
            dataDictionary: [
                {
                    root: {
                        schemaId: paragraphSchema2.id,
                        data: {
                            size: ParagraphSize._1,
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
                        data: "Paragraph",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Paragraph 2",
            dataDictionary: [
                {
                    root: {
                        schemaId: paragraphSchema2.id,
                        data: {
                            size: ParagraphSize._2,
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
                        data: "Paragraph",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Paragraph 3",
            dataDictionary: [
                {
                    root: {
                        schemaId: paragraphSchema2.id,
                        data: {
                            size: ParagraphSize._3,
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
                        data: "Paragraph",
                    },
                },
                "root",
            ],
        },
    ],
};

export default paragraphConfig;
