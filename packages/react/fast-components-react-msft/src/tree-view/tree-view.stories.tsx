import React from "react";
import { storiesOf } from "@storybook/react";
import { uniqueId } from "lodash-es";
import { TreeViewItem } from "../tree-view-item";
import { TreeView } from "./";

const generateBeforeOrAfterContent: (className?: string) => React.ReactNode = (
    className?: string
): React.ReactNode => {
    return (
        <svg className={className}>
            <path d="M11.0625 9.79688L13 16L8 12.1562L3 16L4.9375 9.79688L0 6H6.125L8 0L9.875 6H16L11.0625 9.79688ZM11.1016 13.2812C10.9036 12.6354 10.7057 11.9948 10.5078 11.3594C10.3099 10.7188 10.1068 10.0755 9.89844 9.42969C10.4349 9.02865 10.9635 8.625 11.4844 8.21875C12.0052 7.8125 12.5312 7.40625 13.0625 7H9.14062L8 3.35156L6.85938 7H2.9375C3.46875 7.40625 3.99479 7.8125 4.51562 8.21875C5.03646 8.625 5.5651 9.02865 6.10156 9.42969C5.89323 10.0755 5.6901 10.7188 5.49219 11.3594C5.29427 11.9948 5.09635 12.6354 4.89844 13.2812L8 10.8906L11.1016 13.2812Z" />
        </svg>
    );
};

const flatExample: React.ReactNode = [
    <TreeViewItem titleContent="Favorites Bar" key={uniqueId()} />,
    <TreeViewItem titleContent="Read later" key={uniqueId()} />,
    <TreeViewItem titleContent="Other Favs" key={uniqueId()} />,
];

const nestedExample: React.ReactNode = [
    <TreeViewItem
        titleContent="Favorites Bar"
        key={uniqueId()}
        defaultExpanded={true}
        children={[
            <TreeViewItem titleContent="Shopping" key={uniqueId()} />,
            <TreeViewItem
                titleContent="Sports"
                key={uniqueId()}
                selected={true}
                children={[
                    <TreeViewItem titleContent="Football" key={uniqueId()} />,
                    <TreeViewItem titleContent="Formula 1" key={uniqueId()} />,
                ]}
            />,
        ]}
    />,
    <TreeViewItem titleContent="Read later" key={uniqueId()} />,
    <TreeViewItem titleContent="Other Favs" key={uniqueId()} />,
];

const deepNestedExample: React.ReactNode = [
    <TreeViewItem
        titleContent="Favorites Bar"
        key={uniqueId()}
        beforeContent={generateBeforeOrAfterContent}
        children={[
            <TreeViewItem
                titleContent="Shopping"
                key={uniqueId()}
                beforeContent={generateBeforeOrAfterContent}
            />,
            <TreeViewItem
                titleContent="Sports"
                key={uniqueId()}
                beforeContent={generateBeforeOrAfterContent}
                children={[
                    <TreeViewItem
                        titleContent="Football"
                        key={uniqueId()}
                        beforeContent={generateBeforeOrAfterContent}
                        children={[
                            <TreeViewItem
                                titleContent={"Team 1"}
                                key={uniqueId()}
                                beforeContent={generateBeforeOrAfterContent}
                            />,
                            <TreeViewItem
                                titleContent={"Team 2"}
                                key={uniqueId()}
                                selected={true}
                                beforeContent={generateBeforeOrAfterContent}
                            />,
                            <TreeViewItem
                                titleContent={"Team 3"}
                                key={uniqueId()}
                                beforeContent={generateBeforeOrAfterContent}
                            />,
                        ]}
                    />,
                    <TreeViewItem
                        titleContent="Formula 1"
                        beforeContent={generateBeforeOrAfterContent}
                        key={uniqueId()}
                    />,
                ]}
            />,
        ]}
    />,
    <TreeViewItem
        titleContent="Read later"
        key={uniqueId()}
        beforeContent={generateBeforeOrAfterContent}
    />,
    <TreeViewItem
        titleContent="Other Favs"
        key={uniqueId()}
        beforeContent={generateBeforeOrAfterContent}
    />,
];

const nestedExampleWithBeforeContent: React.ReactNode = [
    <TreeViewItem
        titleContent="Favorites Bar"
        key={uniqueId()}
        beforeContent={generateBeforeOrAfterContent}
        children={[
            <TreeViewItem
                titleContent="Shopping"
                key={uniqueId()}
                beforeContent={generateBeforeOrAfterContent}
            />,
            <TreeViewItem
                titleContent="Sports"
                selected={true}
                key={uniqueId()}
                beforeContent={generateBeforeOrAfterContent}
                children={[
                    <TreeViewItem
                        titleContent="Football"
                        key={uniqueId()}
                        beforeContent={generateBeforeOrAfterContent}
                    />,
                    <TreeViewItem
                        titleContent="Formula 1"
                        beforeContent={generateBeforeOrAfterContent}
                        key={uniqueId()}
                    />,
                ]}
            />,
        ]}
    />,
    <TreeViewItem
        titleContent="Read later"
        key={uniqueId()}
        beforeContent={generateBeforeOrAfterContent}
    />,
    <TreeViewItem
        titleContent="Other Favs"
        key={uniqueId()}
        beforeContent={generateBeforeOrAfterContent}
    />,
];

const nestedExampleWithAfterContent: React.ReactNode = [
    <TreeViewItem
        titleContent="Favorites Bar"
        key={uniqueId()}
        defaultExpanded={true}
        afterContent={generateBeforeOrAfterContent}
        children={[
            <TreeViewItem
                titleContent="Shopping"
                key={uniqueId()}
                afterContent={generateBeforeOrAfterContent}
            />,
            <TreeViewItem
                titleContent="Sports"
                key={uniqueId()}
                afterContent={generateBeforeOrAfterContent}
                children={[
                    <TreeViewItem
                        titleContent="Football"
                        key={uniqueId()}
                        afterContent={generateBeforeOrAfterContent}
                    />,
                    <TreeViewItem
                        titleContent="Formula 1"
                        afterContent={generateBeforeOrAfterContent}
                        key={uniqueId()}
                    />,
                ]}
            />,
        ]}
    />,
    <TreeViewItem
        titleContent="Read later"
        key={uniqueId()}
        afterContent={generateBeforeOrAfterContent}
    />,
    <TreeViewItem
        titleContent="Other Favs"
        key={uniqueId()}
        afterContent={generateBeforeOrAfterContent}
    />,
];

storiesOf("Tree View", module)
    .add("Nested and default expanded", () => <TreeView children={nestedExample} />)
    .add("Nested, beforeContent, selected child", () => (
        <TreeView children={nestedExampleWithBeforeContent} />
    ))
    .add("Deeply nested, beforeContent, selected child", () => (
        <TreeView children={deepNestedExample} />
    ))
    .add("Nested, afterContent, default expanded", () => (
        <TreeView children={nestedExampleWithAfterContent} />
    ))
    .add("Flat example", () => <TreeView children={flatExample} />);
