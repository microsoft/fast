import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";

import { TabHandledProps, TabProps } from "./tab.props";
import { configure, shallow } from "enzyme";

import Tab from "./tab";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("tab-panel", (): void => {
    // parametrized tab class name tests
    [
        {
            name: "should correctly assign className from input props",
            tabHandledProps: {} as TabHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled and root class name is empty",
            tabHandledProps: { active: false } as TabHandledProps,
            className: "",
            expectedClassName: null,
        },
        {
            name: "should correctly assign className when is disabled",
            tabHandledProps: { active: false } as TabHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name not present) and managed class given",
            tabHandledProps: {
                active: true,
                managedClasses: {
                    tab: "tab-class",
                },
            } as TabHandledProps,
            className: "",
            expectedClassName: "tab-class",
        },
        {
            name:
                "should correctly assign className when is disabled (name present) and managed class given",
            tabHandledProps: {
                active: true,
                managedClasses: {
                    tab: "tab-class",
                    tab__active: "disabled",
                },
            } as TabHandledProps,
            className: "",
            expectedClassName: "tab-class disabled",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed and root class name present",
            tabHandledProps: {
                active: true,
                managedClasses: {
                    tab: "tab-name",
                    tab__active: "disabled",
                },
            } as TabHandledProps,
            className: "root-name",
            expectedClassName: "tab-name disabled root-name",
        },
    ].forEach(({ name, tabHandledProps, className, expectedClassName }: any) => {
        test(name, () => {
            const props: TabProps = { ...tabHandledProps };

            const rendered: any = shallow(<Tab {...props} className={className} />);

            expect(rendered.prop("className")).toEqual(expectedClassName);
        });
    });
});
