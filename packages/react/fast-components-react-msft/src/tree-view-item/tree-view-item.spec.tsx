import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { DisplayNamePrefix } from "../utilities";
import TreeViewItem from "./tree-view-item";
import {
    TreeViewItemHandledProps,
    TreeViewItemProps,
    TreeViewItemUnhandledProps,
} from "./tree-view-item.props";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("TreeViewItem", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(TreeViewItem as any).name}`).toBe(
            TreeViewItem.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<TreeViewItem children={""} />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", () => {
        const handledProps: TreeViewItemHandledProps = {
            titleContent: "Foo",
        };
        const unhandledProps: TreeViewItemUnhandledProps = {
            "aria-label": "true",
        };

        const props: TreeViewItemProps = { ...handledProps, ...unhandledProps };
        const rendered: any = shallow(<TreeViewItem {...props} />);

        expect(rendered.first().prop("aria-label")).toBe("true");
    });

    test("should render prop into the before content location if prop exists", () => {
        const props: TreeViewItemProps = {
            titleContent: "Foo",
            managedClasses: {
                treeViewItem_beforeContent: "before-content",
            },
            beforeContent: (classname?: string): React.ReactNode => {
                return (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className={classname}
                    >
                        <path d="M10.3906 9.39844C11.099 9.64323" fill="black" />
                    </svg>
                );
            },
        };

        const rendered: any = mount(<TreeViewItem {...props} />);

        expect(rendered.find("svg")).not.toBe(undefined);
        expect(rendered.find(".before-content").at(0).type()).toEqual("svg");
    });

    test("should render prop into the after content location if prop exists", () => {
        const props: TreeViewItemProps = {
            titleContent: "Foo",
            managedClasses: {
                treeViewItem_afterContent: "after-content",
            },
            id: "fooId",
            afterContent: (classname?: string): React.ReactNode => {
                return (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className={classname}
                    >
                        <path d="M10.3906 9.39844C11.099 9.64323" fill="black" />
                    </svg>
                );
            },
        };

        const rendered: any = mount(<TreeViewItem {...props} />);

        expect(rendered.find("svg")).not.toBe(undefined);
        expect(rendered.find(".after-content").at(0).type()).toEqual("svg");
    });
});
