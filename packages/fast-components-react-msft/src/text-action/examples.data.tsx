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
        beforeGlyph: (classname?: string): React.ReactNode => {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-4014.4 1616.998 4.4 8"
                    className={classname}
                >
                    <g transform="translate(-4128 1600.698)">
                        <path
                            d="M140.6,23.9l3.7-3.6-3.7-3.6.4-.4,4,4-4,4Z"
                            transform="translate(-27)"
                        />
                    </g>
                </svg>
            );
        },
        afterGlyph: (classname?: string): React.ReactNode => {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-4014.4 1616.998 4.4 8"
                    className={classname}
                >
                    <g transform="translate(-4128 1600.698)">
                        <path
                            d="M140.6,23.9l3.7-3.6-3.7-3.6.4-.4,4,4-4,4Z"
                            transform="translate(-27)"
                        />
                    </g>
                </svg>
            );
        },
    },
    data: [
        {
            children: "Text action",
            button: (classname?: string): React.ReactNode => {
                return <Button className={classname} />;
            },
            beforeGlyph: (classname?: string): React.ReactNode => {
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-4014.4 1616.998 4.4 8"
                        className={classname}
                    >
                        <g transform="translate(-4128 1600.698)">
                            <path
                                d="M140.6,23.9l3.7-3.6-3.7-3.6.4-.4,4,4-4,4Z"
                                transform="translate(-27)"
                            />
                        </g>
                    </svg>
                );
            },
            afterGlyph: (classname?: string): React.ReactNode => {
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-4014.4 1616.998 4.4 8"
                        className={classname}
                    >
                        <g transform="translate(-4128 1600.698)">
                            <path
                                d="M140.6,23.9l3.7-3.6-3.7-3.6.4-.4,4,4-4,4Z"
                                transform="translate(-27)"
                            />
                        </g>
                    </svg>
                );
            },
        },
    ],
} as ComponentFactoryExample<TextActionProps>;
