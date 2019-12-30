import { ComponentViewConfig } from "./data.props";
import {
    Paragraph,
    ParagraphProps,
    paragraphSchema,
    ParagraphSize,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/paragraph/guidance";
import API from "../../.tmp/paragraph/api";

const paragraphConfig: ComponentViewConfig<ParagraphProps> = {
    api: API,
    schema: paragraphSchema,
    component: Paragraph,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Paragraph 1",
            data: {
                children: "Paragraph",
                size: ParagraphSize._1,
            },
        },
        {
            displayName: "Paragraph 2",
            data: {
                children: "Paragraph",
                size: ParagraphSize._2,
            },
        },
        {
            displayName: "Paragraph 3",
            data: {
                children: "Paragraph",
                size: ParagraphSize._3,
            },
        },
    ],
};

export default paragraphConfig;
