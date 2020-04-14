import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper, shallow } from "enzyme";
import TreeViewItem from "../tree-view-item";
import { DisplayNamePrefix } from "../utilities";
import TreeView from "./tree-view";
import {
    TreeViewHandledProps,
    TreeViewProps,
    TreeViewUnhandledProps,
} from "./tree-view.props";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("TreeView", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(TreeView as any).name}`).toBe(
            TreeView.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<TreeView children={""} />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", () => {
        const handledProps: TreeViewHandledProps = {
            children: "",
        };
        const unhandledProps: TreeViewUnhandledProps = {
            "aria-label": "true",
        };

        const props: TreeViewProps = { ...handledProps, ...unhandledProps };
        const rendered: any = shallow(<TreeView {...props} />);

        expect(rendered.first().prop("aria-label")).toBe("true");
    });

    test("should initialize with the tree role", (): void => {
        const rendered: ReactWrapper = mount(<TreeView children={""} />);

        expect(rendered.children().prop("role")).toBe("tree");
    });

    test("should render in the tab-order", (): void => {
        const rendered: ReactWrapper = mount(<TreeView children={""} />);

        expect(rendered.children().prop("tabIndex")).toBe(0);
        expect(rendered.state("focusable")).toBe(true);
    });

    test("should be removed from the tab-order when a child element is focused", (): void => {
        const rendered: ReactWrapper = mount(
            <TreeView>
                <div role="treeitem" tabIndex={0} />
            </TreeView>
        );
        rendered.simulate("focus", {
            target: document.createElement("div"),
        });

        expect(rendered.children().prop("tabIndex")).toBe(-1);
        expect(rendered.state("focusable")).toBe(false);
    });

    // Test is incompatible with Jest 25.x, refer to issue #2883
    xtest("should focus a `selected` child element if one exists when focus is brought to it", (): void => {
        const rendered: ReactWrapper = mount(
            <TreeView>
                <div
                    id={"shouldBeActive"}
                    role="treeitem"
                    tabIndex={0}
                    aria-selected={true}
                />
            </TreeView>
        );
        rendered.simulate("focus");

        const expectedElementWithFocus: any = rendered.find("#shouldBeActive").prop("id");

        expect(document.activeElement.id).toBe(expectedElementWithFocus);
    });

    // Test is incompatible with Jest 25.x, refer to issue #2884
    xtest("should focus a `treeitem` when focus is brought to it and there is not a previously focused or selected item", (): void => {
        const rendered: ReactWrapper = mount(
            <TreeView id={"root"}>
                <div id={"shouldBeActive"} role="treeitem" />
            </TreeView>
        );
        rendered.simulate("focus");

        const expectedElementWithFocus: any = rendered.find("#shouldBeActive").prop("id");

        expect(document.activeElement.id).toBe(expectedElementWithFocus);

        rendered.unmount();
    });

    test("should be added to the tab-order when a child element is blurred and the relatedTarget is not in the Tree", (): void => {
        const rendered: ReactWrapper = mount(
            <TreeView>
                <div role="treeitem" tabIndex={0} />
            </TreeView>
        );
        rendered.simulate("focus", {
            target: document.createElement("div"),
        });
        rendered.simulate("blur", {
            target: document.createElement("div"),
            relatedTarget: null,
        });

        expect(rendered.children().prop("tabIndex")).toBe(0);
        expect(rendered.state("focusable")).toBe(true);
    });

    test("should not be in nested mode when no child nodes have children", (): void => {
        const rendered: ReactWrapper = mount(
            <TreeView>
                <TreeViewItem titleContent="foo" />
                <TreeViewItem titleContent="foo" />
                <TreeViewItem titleContent="foo" />
            </TreeView>
        );

        expect(rendered.state("nested")).toBe(false);
    });

    test("should be in nested mode when a child tree-view-item has nested nodes", (): void => {
        const rendered: ReactWrapper = mount(
            <TreeView>
                <TreeViewItem titleContent="foo">
                    <TreeViewItem titleContent="bar" />
                </TreeViewItem>
            </TreeView>
        );

        expect(rendered.state("nested")).toBe(true);
    });
});
