import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { TabsItem } from "@microsoft/fast-components-react-base";
import MSFTPivot, {
    PivotClassNameContract,
    PivotHandledProps,
    PivotUnhandledProps,
} from "./pivot";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: PivotClassNameContract = {
    pivot: "pivot-class",
    pivot_activeIndicator: "pivot_activeIndicator-class",
    pivot_activeIndicator__focused: "pivot_activeIndicator__focused-class",
    pivot_item: "pivot_item-class",
    pivot_item__active: "pivot_item__active-class",
    pivot_itemList: "pivot_itemList-class",
    pivot_tabPanel: "pivot_tabPanel-class",
    pivot_tabPanel__hidden: "pivot_tabPanel__hidden-class",
    pivot_tabPanelContent: "pivot_tabPanelContent-class",
    pivot_tabPanels: "pivot_tabPanels-class",
    pivot_tabPanels__fromLeft: "pivot_tabPanels__fromLeft-class",
    pivot_tabPanels__fromRight: "pivot_tabPanels__fromRight-class",
};

const id0: string = "pivot01";
const id1: string = "pivot02";
const id2: string = "pivot03";

describe("pivot", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTPivot as any).name).toBe(MSFTPivot.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTPivot label="a label for testing" />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", (): void => {
        const handledProps: PivotHandledProps = {
            label: "Test",
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

    test("should set offsetX state to when offsetX state is set", () => {
        const rendered: any = mount(<MSFTPivot label="label for testing" />);

        rendered.setState({ offsetX: 50 });

        expect(rendered.state("offsetX")).toBe(50);
        expect(
            rendered
                .find("span")
                .first()
                .html()
        ).toContain("translateX(50px)");
    });

    test("should render with focus class if focus is true", () => {
        const rendered: any = mount(
            <MSFTPivot managedClasses={managedClasses} label="label for testing" />
        );

        expect(rendered.state("focused")).toBe(false);

        rendered.setState({ focused: true });

        expect(rendered.state("focused")).toBe(true);
        expect(
            rendered
                .find("span")
                .first()
                .prop("className")
        ).toContain(
            `${managedClasses.pivot_activeIndicator} ${
                managedClasses.pivot_activeIndicator__focused
            }`
        );
    });

    function renderTab(tabTitle: string, className?: string): () => React.ReactNode {
        return (): React.ReactNode => <div className={className}>{tabTitle}</div>;
    }

    function renderTabContent(
        tabContent: string,
        className?: string
    ): () => React.ReactNode {
        return (): React.ReactNode => <div className={className}>{tabContent}</div>;
    }
    const tabItem1: TabsItem = {
        tab: renderTab("tab one"),
        content: renderTabContent("tab one content"),
        id: id0,
    };

    const tabItem2: TabsItem = {
        tab: renderTab("tab two"),
        content: renderTabContent("tab two content"),
        id: id1,
    };

    const tabItem3: TabsItem = {
        tab: renderTab("tab three"),
        content: renderTabContent("tab three content"),
        id: id2,
    };
    const detailTabItemData: TabsItem[] = [tabItem1, tabItem2, tabItem3];

    test("should correctly set active ID", () => {
        const renderedWithChildren: any = mount(
            <MSFTPivot
                managedClasses={managedClasses}
                label={"items"}
                activeId={id1}
                items={detailTabItemData}
            />
        );

        expect(
            renderedWithChildren
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(0);
    });

    test("should correctly set tab class", () => {
        const renderedWithChildren: any = mount(
            <MSFTPivot
                managedClasses={managedClasses}
                label={"items"}
                activeId={id1}
                items={detailTabItemData}
            />
        );

        expect(
            renderedWithChildren
                .find("Tab")
                .at(0)
                .childAt(0)
                .prop("className")
        ).toContain(`${managedClasses.pivot_item}`);
    });

    test("should correctly set tabPanel class", () => {
        const renderedWithChildren: any = mount(
            <MSFTPivot
                managedClasses={managedClasses}
                label={"items"}
                activeId={id1}
                items={detailTabItemData}
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
