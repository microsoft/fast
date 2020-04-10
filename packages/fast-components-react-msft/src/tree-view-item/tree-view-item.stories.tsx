import React from "react";
import { storiesOf } from "@storybook/react";
import { TreeViewItem } from "./";

const generateBeforeOrAfterContent: (className?: string) => React.ReactNode = (
    className?: string
): React.ReactNode => {
    return (
        <svg className={className}>
            <path d="M11.0625 9.79688L13 16L8 12.1562L3 16L4.9375 9.79688L0 6H6.125L8 0L9.875 6H16L11.0625 9.79688ZM11.1016 13.2812C10.9036 12.6354 10.7057 11.9948 10.5078 11.3594C10.3099 10.7188 10.1068 10.0755 9.89844 9.42969C10.4349 9.02865 10.9635 8.625 11.4844 8.21875C12.0052 7.8125 12.5312 7.40625 13.0625 7H9.14062L8 3.35156L6.85938 7H2.9375C3.46875 7.40625 3.99479 7.8125 4.51562 8.21875C5.03646 8.625 5.5651 9.02865 6.10156 9.42969C5.89323 10.0755 5.6901 10.7188 5.49219 11.3594C5.29427 11.9948 5.09635 12.6354 4.89844 13.2812L8 10.8906L11.1016 13.2812Z" />
        </svg>
    );
};

storiesOf("Tree View Item", module)
    .add("Title Only", () => <TreeViewItem titleContent="Favorites" />)
    .add("Title, selected", () => (
        <TreeViewItem titleContent="Favorites" selected={true} />
    ))
    .add("Title, before content", () => (
        <TreeViewItem
            titleContent="Favorites"
            beforeContent={generateBeforeOrAfterContent}
        />
    ))
    .add("Title, before content, selected", () => (
        <TreeViewItem
            titleContent="Favorites"
            beforeContent={generateBeforeOrAfterContent}
            selected={true}
        />
    ))
    .add("Title, after content", () => (
        <TreeViewItem
            titleContent="Favorites"
            afterContent={generateBeforeOrAfterContent}
        />
    ))
    .add("Title, after content, selected", () => (
        <TreeViewItem
            titleContent="Favorites"
            afterContent={generateBeforeOrAfterContent}
            selected={true}
        />
    ));
