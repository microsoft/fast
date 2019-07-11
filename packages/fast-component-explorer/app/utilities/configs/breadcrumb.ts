import { ComponentViewConfig } from "./data.props";
import {
    Breadcrumb,
    BreadcrumbProps,
    breadcrumbSchema,
    hypertextSchema,
} from "@microsoft/fast-components-react-msft";
import reactHtmlElementSchema from "../components/react-html-element.schema";
import Guidance from "../../.tmp/breadcrumb/guidance";

const breadcrumbConfig: ComponentViewConfig<BreadcrumbProps> = {
    schema: breadcrumbSchema,
    component: Breadcrumb,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                label: "",
                separator: {
                    id: reactHtmlElementSchema.id,
                    props: {
                        children: "/",
                    },
                } as any,
                children: [
                    {
                        id: hypertextSchema.id,
                        props: {
                            href: "https://www.microsoft.com/en-us/",
                            children: "breadcrumb item 1",
                        },
                    },
                    {
                        id: hypertextSchema.id,
                        props: {
                            href: "https://www.microsoft.com/en-us/",
                            children: "breadcrumb item 2",
                        },
                    },
                    {
                        id: hypertextSchema.id,
                        props: {
                            children: "breadcrumb item 3",
                        },
                    },
                ],
            },
        },
    ],
};

export default breadcrumbConfig;
