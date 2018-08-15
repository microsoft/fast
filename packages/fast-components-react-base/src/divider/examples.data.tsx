import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Divider, { IDividerHandledProps, IDividerManagedClasses, IDividerUnhandledProps } from "./divider";
import schema from "./divider.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: IComponentFactoryExample<IDividerHandledProps & IDividerManagedClasses> = {
    name: "Divider",
    component: Divider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            divider: "divider"
        }
    },
    data: [
        {
            managedClasses: {
                divider: "divider"
            }
        }
    ]
};

export default examples;
