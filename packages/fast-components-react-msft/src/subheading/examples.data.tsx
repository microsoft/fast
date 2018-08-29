import * as React from "react";
import { IComponentFactoryExample  } from "@microsoft/fast-development-site-react";
import Subheading from "./index";
import { 
    SubheadingLevel,
    SubheadingTag,
    SubheadingProps,
    ISubheadingHandledProps,
    ISubheadingUnhandledProps
} from "./subheading.props";

import schema from "./subheading.schema.json";

import Documentation from "./.tmp/documentation";

const testString: string = "Subheading test string";

export default {
    name: "Subheading",
    component: Subheading,
    schema: schema as any,
    documenation: <Documentation />,
    detailData: {
        children: "Subheading test"
    },
    data: [
        {
            children: testString
        }
    ]
} as IComponentFactoryExample<ISubheadingHandledProps>;