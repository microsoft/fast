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
            (<div slot={ProgressType.determinate}>determinate</div>),
            (<div slot={ProgressType.determinate}>determinate</div>)
        ]
    },
    data: [
        {
            ...classes,
            value: 50,
            children: [
                (<div slot={ProgressType.indeterminate}>indeterminate</div>),
                (<div slot={ProgressType.determinate}>determinate</div>)
            ]
        },
        {
            ...classes,
            children: [
                (<div slot={ProgressType.indeterminate}>indeterminate</div>),
                (<div slot={ProgressType.indeterminate}>indeterminate</div>)
            ]
        }
    ]
};

export default examples;
