import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper, shallow } from "enzyme";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnter,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import { TreeViewContext } from "../tree-view/tree-view";
import { DisplayNamePrefix } from "../utilities";
import {
    TreeViewItemHandledProps,
    TreeViewItemProps,
    TreeViewItemUnhandledProps,
} from "./tree-view-item.props";
import TreeViewItem from "./tree-view-item";

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

    test("should initialize with the treeitem role", (): void => {
        const rendered: any = mount(<TreeViewItem titleContent="item" />);

        expect(rendered.children().prop("role")).toBe("treeitem");
    });

    test("should not initialize with the aria-expanded if the item has no children", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item" defaultExpanded={true} />
        );

        expect(rendered.children().prop("aria-expanded")).toBe(undefined);
    });

    test("should initialize with aria-expanded set to false if the item has children but no defaultExpanded", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
        );

        expect(rendered.children().prop("aria-expanded")).toBe(false);
    });

    test("should initialize outside of the taborder", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
        );

        expect(rendered.children().prop("tabIndex")).toBe(-1);
    });

    test("should set tabindex to 0 when focused", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
        );

        rendered.simulate("focus");

        expect(rendered.children().prop("tabIndex")).toBe(0);
    });

    test("should set tabindex to back to -1 when blurred", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
        );

        rendered.simulate("focus");

        expect(rendered.children().prop("tabIndex")).toBe(0);

        rendered.simulate("blur");

        expect(rendered.children().prop("tabIndex")).toBe(-1);
    });

    test("should always render with an aria-selected attribute", (): void => {
        const undef: any = mount(
            <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
        );
        const truthy: any = mount(
            <TreeViewItem titleContent="item" selected={true}>
                "hello world"
            </TreeViewItem>
        );
        const falsey: any = mount(
            <TreeViewItem titleContent="item" selected={false}>
                "hello world"
            </TreeViewItem>
        );

        expect(undef.children().prop("aria-selected")).toBe(false);
        expect(falsey.children().prop("aria-selected")).toBe(false);
        expect(truthy.children().prop("aria-selected")).toBe(true);
    });

    test("should intialize with aria-expanded set to defaultExpanded if provided", (): void => {
        const renderedFalse: any = mount(
            <TreeViewItem titleContent="item" defaultExpanded={false}>
                "hello world"
            </TreeViewItem>
        );

        const renderedTrue: any = mount(
            <TreeViewItem titleContent="item" defaultExpanded={true}>
                "hello world"
            </TreeViewItem>
        );

        expect(renderedFalse.children().prop("aria-expanded")).toBe(false);
        expect(renderedTrue.children().prop("aria-expanded")).toBe(true);
    });

    test("should intialize with aria-expanded set to true if a child node is selected", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item">
                <TreeViewItem titleContent="child" selected={true} />
            </TreeViewItem>
        );

        expect(rendered.children().prop("aria-expanded")).toBe(true);
    });

    test("should intialize with aria-expanded set to true if a child node is selected and defaultExpanded is `false`", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item" defaultExpanded={false}>
                <TreeViewItem titleContent="child" selected={true} />
            </TreeViewItem>
        );

        expect(rendered.children().prop("aria-expanded")).toBe(true);
    });

    test("should set an aria-expanded value of true if children are added after initialization", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item" defaultExpanded={true} />
        );

        expect(rendered.state("expanded")).toBe(undefined);
        expect(rendered.children().prop("aria-expanded")).toBe(undefined);

        rendered.setProps({
            children: [
                <TreeViewItem titleContent="child" key={0} selected={true} />,
                <TreeViewItem titleContent="child2" key={1} selected={true} />,
            ],
        });
        rendered.update();

        expect(rendered.state("expanded")).toBe(true);
        expect(rendered.children().prop("aria-expanded")).toBe(true);
    });

    test("should be initially rendered outside of the default tab order", (): void => {
        const rendered: any = mount(<TreeViewItem titleContent="item" />);
        expect(rendered.children().prop("tabIndex")).toBe(-1);
    });

    test("should be placed in the default tab order after explicitly focused", (): void => {
        const rendered: any = mount(<TreeViewItem titleContent="item" />);
        rendered.simulate("focus");
        expect(rendered.children().prop("tabIndex")).toBe(0);
    });

    test("should collapse an open item when left arrow is pressed", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
        );
        rendered.setState({ expanded: true });
        expect(rendered.children().prop("aria-expanded")).toBe(true);

        rendered.simulate("keyDown", { keyCode: keyCodeArrowLeft });

        expect(rendered.children().prop("aria-expanded")).toBe(false);
    });

    test("should collapse an open item when space bar is pressed", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
        );
        rendered.setState({ expanded: true });
        expect(rendered.children().prop("aria-expanded")).toBe(true);

        rendered.simulate("keyDown", { keyCode: keyCodeSpace });

        expect(rendered.children().prop("aria-expanded")).toBe(false);
    });

    test("should expand an open item when right arrow is pressed", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
        );
        rendered.setState({ expanded: false });
        expect(rendered.children().prop("aria-expanded")).toBe(false);

        rendered.simulate("keyDown", { keyCode: keyCodeArrowRight });

        expect(rendered.children().prop("aria-expanded")).toBe(true);
    });

    test("should prevent default behavior on arrow down to prevent scroll events", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item" defaultExpanded={true}>
                <TreeViewItem titleContent="child" />
            </TreeViewItem>
        );

        const preventDefault: any = jest.fn();
        rendered.simulate("keyDown", { keyCode: keyCodeArrowDown, preventDefault });

        expect(preventDefault).toHaveBeenCalled();
    });

    test("should prevent default behavior on arrow up to prevent scroll events", (): void => {
        const rendered: any = mount(
            <TreeViewItem titleContent="item" defaultExpanded={true}>
                <TreeViewItem titleContent="child" />
            </TreeViewItem>
        );

        const preventDefault: any = jest.fn();
        rendered.simulate("keyDown", { keyCode: keyCodeArrowUp, preventDefault });

        expect(preventDefault).toHaveBeenCalled();
    });

    test("should render with a nested class when nested", (): void => {
        const nestedClass: string = "treeViewItem__nested";
        const rendered: ReactWrapper = mount(
            <TreeViewContext.Provider value={{ nested: true } as any}>
                <TreeViewItem
                    titleContent="item"
                    managedClasses={{ treeViewItem__nested: nestedClass }}
                />
            </TreeViewContext.Provider>
        );

        expect(rendered.children().prop("className")).toBe(nestedClass);
    });

    test("should not render with a nested class when not nested", (): void => {
        const nestedClass: string = "treeViewItem__nested";
        const rendered: ReactWrapper = mount(
            <TreeViewContext.Provider value={{ nested: false } as any}>
                <TreeViewItem
                    titleContent="item"
                    managedClasses={{ treeViewItem__nested: nestedClass }}
                />
            </TreeViewContext.Provider>
        );

        expect(rendered.children().prop("className")).toBe(null);
    });

    /* eslint-disable react/display-name */
    test("should wrap the `treeViewItem_contentRegion` in a node provided to the `dragConnect` prop when passed", () => {
        const props: TreeViewItemProps = {
            managedClasses: {
                treeViewItem_contentRegion: "content-region",
            },
            titleContent: "Foo",
            dragConnect: (dragElement?: React.ReactElement<any>): React.ReactElement => {
                return <div id="draggable">{dragElement}</div>;
            },
        };

        const rendered: any = mount(<TreeViewItem {...props} />);

        expect(rendered.find("#draggable").find(".content-region").length).toBe(1);
        expect(rendered.find("#draggable").type()).toEqual("div");
        expect(rendered.find("#draggable").html());
    });

    test("should render a prop into the `expandCollapseGlyph` location if prop exists", () => {
        const props: TreeViewItemProps = {
            children: <TreeViewItem titleContent="bar" />,
            managedClasses: {
                treeViewItem_expandCollapseGlyph: "expand-collapse-glyph",
            },
            titleContent: "Foo",
            expandCollapseGlyph: (classname?: string): React.ReactNode => {
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
        expect(rendered.find(".expand-collapse-glyph").type()).toEqual("svg");
    });
    /* eslint-enable react/display-name */
    test("should not notify parent context when an item renders without child nodes", (): void => {
        const nestedClass: string = "treeViewItem__nested";
        const spy: any = jest.fn();
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const rendered: ReactWrapper = mount(
            <TreeViewContext.Provider value={{ adjustNestedTreeItemCount: spy } as any}>
                <TreeViewItem
                    titleContent="item"
                    managedClasses={{ treeViewItem__nested: nestedClass }}
                />
            </TreeViewContext.Provider>
        );

        expect(spy).not.toHaveBeenCalled();
    });

    test("should notify parent context when an item mounts with child nodes", (): void => {
        const nestedClass: string = "treeViewItem__nested";
        const spy: any = jest.fn();
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const rendered: ReactWrapper = mount(
            <TreeViewContext.Provider value={{ adjustNestedTreeItemCount: spy } as any}>
                <TreeViewItem
                    titleContent="item"
                    managedClasses={{ treeViewItem__nested: nestedClass }}
                >
                    <TreeViewItem
                        titleContent="item"
                        managedClasses={{ treeViewItem__nested: nestedClass }}
                    />
                </TreeViewItem>
            </TreeViewContext.Provider>
        );

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe(1);
    });

    test("should notify parent context when an item unmounts with child nodes", (): void => {
        const nestedClass: string = "treeViewItem__nested";
        const spy: any = jest.fn();

        const rendered: ReactWrapper = mount(
            <TreeViewContext.Provider value={{ adjustNestedTreeItemCount: spy } as any}>
                <TreeViewItem
                    titleContent="item"
                    managedClasses={{ treeViewItem__nested: nestedClass }}
                >
                    <TreeViewItem
                        titleContent="item"
                        managedClasses={{ treeViewItem__nested: nestedClass }}
                    />
                </TreeViewItem>
            </TreeViewContext.Provider>
        );
        rendered.unmount();

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy.mock.calls[1][0]).toBe(-1);
    });

    describe("callbacks", (): void => {
        xtest("should call onExpandedChange when an expandable item is expanded or collapsed", (): void => {
            const spy: any = jest.fn();

            const rendered: any = mount(
                <TreeViewItem
                    titleContent="item"
                    onExpandedChange={spy}
                    managedClasses={{
                        treeViewItem_expandCollapseButton: "expand-button",
                    }}
                >
                    <TreeViewItem titleContent="item2" />
                </TreeViewItem>
            );

            const collapseExpandButton: any = rendered.find(".expand-button");

            rendered.simulate("keyDown", { keyCode: keyCodeArrowRight });
            expect(spy.mock.calls[0][0]).toBe(true);

            rendered.simulate("keyDown", { keyCode: keyCodeArrowLeft });
            expect(spy.mock.calls[1][0]).toBe(false);

            collapseExpandButton.simulate("click");
            expect(spy.mock.calls[2][0]).toBe(true);

            rendered.simulate("click");
            expect(spy).toBeCalledTimes(3);
        });

        test("should call onSelected when the item is selected by the user", (): void => {
            const spy: any = jest.fn();

            const rendered: any = mount(
                <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
            );

            rendered.simulate("keyDown", { keyCode: keyCodeEnter });
            expect(spy).toHaveBeenCalledTimes(0);

            rendered.setProps({ onSelected: spy });

            rendered.simulate("keyDown", { keyCode: keyCodeEnter });
            expect(spy).toHaveBeenCalledTimes(1);

            const clickTarget: any = rendered.children().first().children().first();
            clickTarget.simulate("click");

            expect(spy).toHaveBeenCalledTimes(2);
        });

        test("should call onSelected if the component is updated with a new prop of `selected`", (): void => {
            const spy: any = jest.fn();

            const rendered: any = mount(
                <TreeViewItem titleContent="item">"hello world"</TreeViewItem>
            );

            rendered.simulate("keyDown", { keyCode: keyCodeEnter });
            expect(spy).toHaveBeenCalledTimes(0);

            rendered.setProps({ selected: true, onSelected: spy });

            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("should call a childs `onSelected` callback if the child is updated with a new prop of `selected`", (): void => {
            const childOnSelectedSpy: any = jest.fn();

            const rendered: any = mount(
                <TreeViewItem titleContent="item">
                    <TreeViewItem
                        id={"child"}
                        titleContent="child"
                        onSelected={childOnSelectedSpy}
                    />
                </TreeViewItem>
            );

            rendered.simulate("keyDown", { keyCode: keyCodeEnter });
            expect(childOnSelectedSpy).toHaveBeenCalledTimes(0);

            rendered.find("#child").at(0).simulate("keyDown", { keyCode: keyCodeEnter });
            expect(childOnSelectedSpy).toHaveBeenCalledTimes(1);
        });

        xtest("should call onExpandedChange when the item is expanded", (): void => {
            const spy: any = jest.fn();

            const rendered: any = mount(
                <TreeViewItem titleContent="item" onExpandedChange={spy}>
                    <TreeViewItem titleContent="child" />
                </TreeViewItem>
            );

            rendered.simulate("keyDown", { keyCode: keyCodeArrowRight });
            rendered.simulate("keyDown", { keyCode: keyCodeArrowLeft });
            expect(spy).toHaveBeenCalledTimes(2);
        });

        xtest("should expand all parents and grandparents when a child is selected", (): void => {
            const spy: any = jest.fn();

            const rendered: any = mount(
                <TreeViewItem titleContent="item" onExpandedChange={spy}>
                    <TreeViewItem titleContent="child1" onExpandedChange={spy}>
                        <TreeViewItem id="selectTarget" titleContent="child2" />
                    </TreeViewItem>
                </TreeViewItem>
            );

            expect(rendered.state().expanded).toBe(false);
            const child2: any = rendered.find("#selectTarget").first();
            child2.simulate("keyDown", { keyCode: keyCodeEnter });
            expect(spy).toHaveBeenCalledTimes(2);
            expect(rendered.state().expanded).toBe(true);
        });

        test("should expand all parents and grandparents when a selected child is added after initial render", (): void => {
            const spy: any = jest.fn();
            const childSpy: any = jest.fn();

            const rendered: any = mount(
                <TreeViewItem titleContent="item" onExpandedChange={spy} />
            );

            expect(spy).toHaveBeenCalledTimes(0);

            expect(rendered.state().expanded).toBe(undefined);

            rendered.setProps({
                children: (
                    <TreeViewItem titleContent="child1" onExpandedChange={childSpy}>
                        <TreeViewItem titleContent="child2" selected={true} />
                    </TreeViewItem>
                ),
            });

            rendered.update();

            expect(spy).toHaveBeenCalledTimes(2);
            expect(childSpy).toHaveBeenCalledTimes(1);
            expect(rendered.state().expanded).toBe(true);
        });

        test("should expand all parents and grandparents and NOT call onExpandedChange when a selected child is added after initial render with a prop of defaultExpanded", (): void => {
            const spy: any = jest.fn();

            const rendered: any = mount(
                <TreeViewItem
                    titleContent="item"
                    onExpandedChange={spy}
                    defaultExpanded={true}
                />
            );

            expect(spy).toHaveBeenCalledTimes(0);

            expect(rendered.state().expanded).toBe(undefined);

            rendered.setProps({
                children: <TreeViewItem titleContent="child1" selected={true} />,
            });

            rendered.update();

            expect(spy).toHaveBeenCalledTimes(0);
            expect(rendered.state().expanded).toBe(true);
        });
    });
});
