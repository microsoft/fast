import * as React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Divider, {
    DividerHandledProps,
    DividerManagedClasses,
    DividerUnhandledProps,
} from "./divider";
import schema from "./divider.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: ComponentFactoryExample<DividerHandledProps> = {
    name: "Divider",
    component: Divider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            divider: "divider",
        },
    },
    data: [
        {
            managedClasses: {
                divider: "divider",
            },
        },
    ],
};

export default examples;
