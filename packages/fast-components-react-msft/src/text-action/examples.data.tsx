import * as React from "react";
import { TextAction, TextActionProps } from "./index";
import schema from "./text-action.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Button } from "../button";

function renderButton(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => <Button className={className} />;
}

export default {
    name: "Text action",
    component: TextAction,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "foo",
        button: renderButton(),
    },
    data: [
        {
            children: "Text action",
            button: renderButton(),
        },
    ],
} as ComponentFactoryExample<TextActionProps>;
