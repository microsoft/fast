import * as React from "react";
import { Pivot, PivotHandledProps, PivotProps, PivotManagedClasses } from "./index";
import { TabsItem } from "@microsoft/fast-components-react-base";
import schema from "./pivot.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const pivotManagedClasses: PivotManagedClasses = {
    managedClasses: {
        pivot: "pivot-class",
        pivot_itemList: "pivot_itemList-class",
        pivot_item: "pivot_item-class",
        pivot_item__active: "pivot_item__active-class",
        pivot_tabPanels: "pivot_tabPanels-class",
        pivot_tabPanel: "pivot_tabPanel-class",
        pivot_tabPanel__hidden: "pivot_tabPanel__hidden-class",
        pivot_tabPanelContent: "pivot_tabPanelContent-class",
    },
};

function renderPivot(pivotTitle: string): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>{pivotTitle}</div>
    );
}

function renderPivotContent(
    pivotContent: string
): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>{pivotContent}</div>
    );
}

const pivotItem1: TabsItem = {
    tab: renderPivot("pivot one"),
    content: renderPivotContent("pivot one content"),
    id: "pivot01",
};

const pivotItem2: TabsItem = {
    tab: renderPivot("pivot two"),
    content: renderPivotContent("pivot two content"),
    id: "pivot02",
};

const pivotItem3: TabsItem = {
    tab: renderPivot("pivot three"),
    content: renderPivotContent("pivot three content"),
    id: "pivot03",
};

const pivotItem4: TabsItem = {
    tab: renderPivot("pivot four"),
    content: renderPivotContent("pivot four content"),
    id: "pivot04",
};

const detailPivotItem: TabsItem[] = [
    Object.assign({}, pivotItem1),
    Object.assign({}, pivotItem2),
    Object.assign({}, pivotItem3),
];

const examplePivotItem1: TabsItem[] = [
    {
        tab: renderPivot(""),
        content: renderPivotContent(""),
        id: "pivot01",
    },
    Object.assign({}, pivotItem2),
    Object.assign({}, pivotItem3),
    Object.assign({}, pivotItem4),
];

const examples: ComponentFactoryExample<PivotProps> = {
    name: "Pivot",
    component: Pivot,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...pivotManagedClasses,
        label: "A set of example text content",
        activeId: "pivot03",
        items: detailPivotItem,
        children: ["child 1", "child 2"],
    },
    data: [
        {
            ...pivotManagedClasses,
            label: "A set of example text content",
            items: detailPivotItem,
            children: ["child 1", "child 2"],
        },
        {
            ...pivotManagedClasses,
            label: "A set of example text content",
            items: examplePivotItem1,
        },
    ],
};

export default examples;
