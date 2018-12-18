import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { TabsItem } from "@microsoft/fast-components-react-base";
import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTPivot, { PivotHandledProps, PivotUnhandledProps } from "./pivot";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: PivotClassNameContract = {
    pivot: "pivot-class",
    pivot_activeIndicator: "pivot_activeIndicator-class",
    pivot_tab: "pivot_tab-class",
    pivot_tab__active: "pivot_tab__active-class",
    pivot_tabList: "pivot_tabList-class",
    pivot_tabPanel: "pivot_tabPanel-class",
    pivot_tabPanel__hidden: "pivot_tabPanel__hidden-class",
    pivot_tabPanelContent: "pivot_tabPanelContent-class",
    pivot_tabPanels: "pivot_tabPanels-class",
    pivot_tabPanels__animatePrevious: "pivot_tabPanels__animatePrevious-class",
    pivot_tabPanels__animateNext: "pivot_tabPanels__animateNext-class",
};

const id0: string = "pivot01";
const id1: string = "pivot02";
const id2: string = "pivot03";

function renderPivot(pivotTitle: string, className?: string): () => React.ReactNode {
    return (): React.ReactNode => <div className={className}>{pivotTitle}</div>;
}

function renderPivotContent(
    pivotContent: string,
    className?: string
): () => React.ReactNode {
    return (): React.ReactNode => <div className={className}>{pivotContent}</div>;
}
const pivotItem1: TabsItem = {
    tab: renderPivot("pivot one"),
    content: renderPivotContent("pivot one content"),
    id: id0,
};

const pivotItem2: TabsItem = {
    tab: renderPivot("pivot two"),
    content: renderPivotContent("pivot two content"),
    id: id1,
};

const pivotItem3: TabsItem = {
    tab: renderPivot("pivot three"),
    content: renderPivotContent("pivot three content"),
    id: id2,
};
const detailPivotItemData: TabsItem[] = [pivotItem1, pivotItem2, pivotItem3];

const detailNull: TabsItem[] = [
    {
        tab: null,
        content: null,
        id: id1,
    },
    {
        tab: null,
        content: null,
        id: id2,
    },
];

describe("pivot", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTPivot as any).name).toBe(MSFTPivot.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTPivot label={"foo"} items={detailPivotItemData} />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", (): void => {
        const handledProps: PivotHandledProps = {
            label: "foo",
            items: detailPivotItemData,
        };

        const unhandledProps: PivotUnhandledProps = {
            "aria-hidden": true,
        };

        const props: PivotHandledProps & PivotUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<MSFTPivot {...props} />);

        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should not error with empty item data", () => {
        const rendered: any = mount(<MSFTPivot label={"foo"} items={[]} />);

        expect(rendered.first().length).toBe(1);
        expect(rendered.find('[role="tablist"]').children().length).toBe(0);
    });

    test("should render with correct tab set as active", () => {
        const rendered: any = mount(
            <MSFTPivot label={"foo"} items={[]} activeId={id2} />
        );

        expect(rendered.state("activeId")).toBe(id2);
    });

    test("should not throw if items return no functions", () => {
        expect(() => {
            shallow(<MSFTPivot label={"foo"} items={detailNull} />);
        }).not.toThrow();
    });

    test("should move to the second pivot item on second pivot item click", () => {
        const rendered: any = mount(
            <MSFTPivot label={"foo"} items={detailPivotItemData} />
        );

        expect(rendered.state("activeId")).toBe(id0);

        rendered
            .find('[role="tab"]')
            .at(1)
            .simulate("click");
        expect(rendered.state("activeId")).toBe(id1);
    });

    test("should set active indicator style translate property when offsetX state is set", () => {
        const rendered: any = mount(
            <MSFTPivot label={"foo"} items={detailPivotItemData} />
        );

        rendered.setState({ offsetX: 50 });

        expect(rendered.state("offsetX")).toBe(50);
        expect(
            rendered
                .find("span")
                .first()
                .html()
        ).toContain("translateX(50px)");
    });

    test("should correctly set active ID", () => {
        const renderedWithChildren: any = mount(
            <MSFTPivot
                managedClasses={managedClasses}
                label={"foo"}
                activeId={id1}
                items={detailPivotItemData}
            />
        );

        expect(
            renderedWithChildren
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(0);
    });

    test("should correctly set pivot item class", () => {
        const renderedWithChildren: any = mount(
            <MSFTPivot
                managedClasses={managedClasses}
                label={"foo"}
                activeId={id1}
                items={detailPivotItemData}
            />
        );

        expect(
            renderedWithChildren
                .find("Tab")
                .at(0)
                .childAt(0)
                .prop("className")
        ).toContain(`${managedClasses.pivot_tab}`);
    });

    test("should correctly set pivot tabPanel class", () => {
        const renderedWithChildren: any = mount(
            <MSFTPivot
                managedClasses={managedClasses}
                label={"foo"}
                activeId={id1}
                items={detailPivotItemData}
            />
        );

        expect(
            renderedWithChildren
                .find("TabPanel")
                .at(0)
                .childAt(0)
                .prop("className")
        ).toContain(`${managedClasses.pivot_tabPanel}`);
    });
});
