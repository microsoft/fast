import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Metatext from "./index";
import {
    IMetatextHandledProps,
    IMetatextManagedClasses,
    IMetatextUnhandledProps,
    MetatextProps,
    MetatextTag
} from "./metatext.props";
import schema from "./metatext.schema.json";
import Documentation from "./.tmp/documentation";

const testString: string = "Metatext test string";

export default {
    name: "Metatext",
    component: Metatext,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Metatext"
    },
    data: [
        {
            children: testString
        },
        {
            tag: MetatextTag.p,
            children: testString,
            "data-sketch-symbol": "Metatext"
        },
        {
            tag: MetatextTag.span,
            children: testString
        }
    ]
} as IComponentFactoryExample<IMetatextHandledProps>;
