import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Pivot, PivotHandledProps, PivotManagedClasses, PivotProps } from "./index";
import Documentation from "./.tmp/documentation";
import { TabsItem } from "@microsoft/fast-components-react-base";
import { uniqueId } from "lodash-es";
import schema from "./pivot.schema.json";
import pivotItemContentSchema from "../../app/components/pivot-item-content.schema.json";
import pivotItemTabSchema from "../../app/components/pivot-item-tab.schema.json";

const pivotManagedClasses: PivotManagedClasses = {
    managedClasses: {
        pivot: "pivot-class",
        pivot_tabList: "pivot_tabList-class",
        pivot_tab: "pivot_tab-class",
        pivot_tab__active: "pivot_tab__active-class",
        pivot_tabPanels: "pivot_tabPanels-class",
        pivot_tabPanels__previous: "pivot_tabPanels__previous-class",
        pivot_tabPanels__next: "pivot_tabPanels__next-class",
        pivot_tabPanel: "pivot_tabPanel-class",
        pivot_tabPanel__hidden: "pivot_tabPanel__hidden-class",
        pivot_tabPanelContent: "pivot_tabPanelContent-class",
    },
};

const pivotItem1: TabsItem = {
    tab: {
        id: pivotItemTabSchema.id,
        props: {
            children: "pivot one",
        },
    } as any,
    content: {
        id: pivotItemContentSchema.id,
        props: {
            children: "pivot one content",
        },
    } as any,
    id: uniqueId(),
};

const pivotItem2: TabsItem = {
    tab: {
        id: pivotItemTabSchema.id,
        props: {
            children: "pivot two",
        },
    } as any,
    content: {
        id: pivotItemContentSchema.id,
        props: {
            children: "pivot two content",
        },
    } as any,
    id: uniqueId(),
};

const pivotItem3: TabsItem = {
    tab: {
        id: pivotItemTabSchema.id,
        props: {
            children: "pivot three",
        },
    } as any,
    content: {
        id: pivotItemContentSchema.id,
        props: {
            children: "pivot three content",
        },
    } as any,
    id: uniqueId(),
};

const pivotItem4: TabsItem = {
    tab: {
        id: pivotItemTabSchema.id,
        props: {
            children: "pivot four",
        },
    } as any,
    content: {
        id: pivotItemContentSchema.id,
        props: {
            children: "pivot four content",
        },
    } as any,
    id: uniqueId(),
};

const detailPivotItem: TabsItem[] = [pivotItem1, pivotItem2, pivotItem3, pivotItem4];

const examplePivotItem1: TabsItem[] = [
    {
        tab: {
            id: pivotItemTabSchema.id,
            props: {},
        } as any,
        content: {
            id: pivotItemContentSchema.id,
            props: {},
        } as any,
        id: uniqueId(),
    },
    pivotItem2,
    pivotItem3,
    pivotItem4,
];

const examples: ComponentFactoryExample<PivotProps> = {
    name: "Pivot",
    component: Pivot,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...pivotManagedClasses,
        label: "A set of example text content",
        items: detailPivotItem,
    },
    data: [
        {
            ...pivotManagedClasses,
            label: "A set of example text content",
            items: detailPivotItem,
        },
        {
            ...pivotManagedClasses,
            label: "A set of example text content",
            items: examplePivotItem1,
        },
    ],
};

export default examples;
