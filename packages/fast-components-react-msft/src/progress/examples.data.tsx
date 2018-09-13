import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Progress from "./index";
import {
    IMSFTProgressHandledProps,
    IMSFTProgressManagedClasses,
    IMSFTProgressUnhandledProps,
    MSFTProgressProps
} from "./progress.props";
import schema from "@microsoft/fast-components-react-base/dist/progress/progress.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

export default {
    name: "Progress",
    component: Progress,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Progress",
        value: 50,
        minValue: 0,
        maxValue: 100
    },
    data: [
        {
            minValue: 0,
            maxValue: 100,
            value: 50
        },
        {}
    ]
} as IComponentFactoryExample<IProgressHandledProps>;
