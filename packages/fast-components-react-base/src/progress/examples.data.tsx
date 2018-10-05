import * as React from "react";
import Progress, {
    ProgressHandledProps,
    ProgressManagedClasses,
    ProgressType,
    ProgressUnhandledProps
} from "./progress";
import schema from "./progress.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import reactHTMLElementSchema from "../../app/components/react-html-element.schema.json";

const classes: ProgressManagedClasses = {
    managedClasses: {
        progress: "progress"
    }
};

const examples: ComponentFactoryExample<ProgressHandledProps> = {
    name: "Progress",
    component: Progress,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...classes,
        value: 0,
        children: [
            {
                id: reactHTMLElementSchema.id,
                props: {
                    slot: ProgressType.determinate,
                    children: "determinate"
                }
            },
            {
                id: reactHTMLElementSchema.id,
                props: {
                    slot: ProgressType.determinate,
                    children: "determinate"
                }
            }
        ]
    },
    data: [
        {
            ...classes,
            value: 50,
            children: [
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        slot: ProgressType.indeterminate,
                        children: "indeterminate"
                    }
                },
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        slot: ProgressType.determinate,
                        children: "determinate"
                    }
                }
            ]
        },
        {
            ...classes,
            children: [
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        slot: ProgressType.indeterminate,
                        children: "indeterminate"
                    }
                },
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        slot: ProgressType.indeterminate,
                        children: "indeterminate"
                    }
                }
            ]
        }
    ]
};

export default examples;
