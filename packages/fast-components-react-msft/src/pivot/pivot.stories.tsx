import { storiesOf } from "@storybook/react";
import React from "react";
import { Pivot } from "./";
import { uniqueId } from "lodash-es";
import API from "./API.md";

storiesOf("Pivot", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => (
        <Pivot
            label="An example pivot component"
            items={[
                {
                    tab: (className?: string): JSX.Element => (
                        <p className={className}>Tab 1</p>
                    ),
                    content: (className?: string): JSX.Element => (
                        <p className={className}>Tab 1 content</p>
                    ),
                    id: uniqueId(),
                },
                {
                    tab: (className?: string): JSX.Element => (
                        <p className={className}>Tab 2</p>
                    ),
                    content: (className?: string): JSX.Element => (
                        <p className={className}>Tab 2 content</p>
                    ),
                    id: uniqueId(),
                },
                {
                    tab: (className?: string): JSX.Element => (
                        <p className={className}>Tab 3</p>
                    ),
                    content: (className?: string): JSX.Element => (
                        <p className={className}>Tab 3 content</p>
                    ),
                    id: uniqueId(),
                },
                {
                    tab: (className?: string): JSX.Element => (
                        <p className={className}>Tab 4</p>
                    ),
                    content: (className?: string): JSX.Element => (
                        <p className={className}>Tab 4 content</p>
                    ),
                    id: uniqueId(),
                },
            ]}
        />
    ));
