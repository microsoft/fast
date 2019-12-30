import { ComponentViewConfig } from "./data.props";
import {
    Breadcrumb,
    BreadcrumbProps,
    breadcrumbSchema,
    hypertextSchema,
} from "@microsoft/fast-components-react-msft";
import { groupSchema } from "../../../app/components/group";
import Guidance from "../../.tmp/breadcrumb/guidance";
import API from "../../.tmp/breadcrumb/api";

const breadcrumbConfig: ComponentViewConfig<BreadcrumbProps> = {
    api: API,
    schema: breadcrumbSchema,
    component: Breadcrumb,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                label: "",
                separator: {
                    id: groupSchema.id,
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
