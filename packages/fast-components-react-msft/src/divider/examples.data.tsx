import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Divider } from "./index";
import { DividerRoles, IDividerHandledProps } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/divider/divider.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Divider",
    component: Divider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        role: void 0
    },
    data: [
        {
            role: void 0,
            "data-sketch-symbol": "Divider"
        },
        {
            role: DividerRoles.presentation
        },
        {
            role: DividerRoles.separator
        }
    ]
} as IComponentFactoryExample<IDividerHandledProps>;
