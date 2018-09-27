import * as React from "react";
import Progress, {
    IProgressHandledProps,
    IProgressManagedClasses,
    IProgressUnhandledProps,
    ProgressType
} from "./progress";
import schema from "./progress.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import reactHTMLElementSchema from "../../app/components/react-html-element.schema.json";

const classes: IProgressManagedClasses = {
    managedClasses: {
        progress: "progress"
    }
};

const examples: IComponentFactoryExample<IProgressHandledProps & IProgressManagedClasses> = {
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
