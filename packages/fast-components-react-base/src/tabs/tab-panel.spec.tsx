import Adapter from "enzyme-adapter-react-16";
import React from "react";

import { TabPanelHandledProps, TabPanelProps } from "./tab-panel.props";
import { configure, shallow, ShallowWrapper } from "enzyme";

import TabPanel from "./tab-panel";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("tab-panel", (): void => {
    test("should have correct element role attribute 'tabpanel'", () => {
        const rendered: ShallowWrapper = shallow(<TabPanel />);
        expect(rendered.first().prop("role")).toBe("tabpanel");
    });

    // parametrized tab panel class name tests
    [
        {
            name: "should correctly assign className from input props",
            tabPanelHandledProps: {} as TabPanelHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled and root class name is empty",
            tabPanelHandledProps: { active: false } as TabPanelHandledProps,
            className: "",
            expectedClassName: null,
        },
        {
            name: "should correctly assign className when is disabled",
            tabPanelHandledProps: { active: false } as TabPanelHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name not present) and managed class given",
            tabPanelHandledProps: {
                active: false,
                managedClasses: {
                    tabPanel: "tab-panel-class",
                },
            } as TabPanelHandledProps,
            className: "",
            expectedClassName: "tab-panel-class",
        },
        {
            name:
                "should correctly assign className when is disabled (name present) and managed class given",
            tabPanelHandledProps: {
                active: false,
                managedClasses: {
                    tabPanel: "tab-panel-class",
                    tabPanel__hidden: "disabled",
                },
            } as TabPanelHandledProps,
            className: "",
            expectedClassName: "tab-panel-class disabled",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed and root class name present",
            tabPanelHandledProps: {
                active: false,
                managedClasses: {
                    tabPanel: "tab-panel-name",
                    tabPanel__hidden: "disabled",
                },
            } as TabPanelHandledProps,
            className: "root-name",
            expectedClassName: "tab-panel-name disabled root-name",
        },
    ].forEach(({ name, tabPanelHandledProps, className, expectedClassName }: any) => {
        test(name, () => {
            const props: TabPanelProps = { ...tabPanelHandledProps };

            const rendered: any = shallow(<TabPanel {...props} className={className} />);

            expect(rendered.prop("className")).toEqual(expectedClassName);
        });
    });
});
