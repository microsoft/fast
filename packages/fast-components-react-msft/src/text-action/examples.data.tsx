import * as React from "react";
import { TextAction, TextActionProps } from "./index";
import schema from "./text-action.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Button } from "../button";

export default {
    name: "Text action",
    component: TextAction,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "foo",
        button: (classname?: string): React.ReactNode => {
            return <Button className={classname}>{"foo"}</Button>;
        },
    },
    data: [
        {
            children: "Text action",
            button: (classname?: string): React.ReactNode => {
                return <Button className={classname} />;
            },
        },
    ],
} as ComponentFactoryExample<TextActionProps>;
