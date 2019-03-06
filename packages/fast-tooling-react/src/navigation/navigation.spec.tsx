import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import { NavigationProps } from "./navigation.props";
import Navigation from "./navigation";
import { ChildOptionItem } from "../data-utilities";

import noChildrenSchema from "../../app/configs/no-children.schema.json";
import childrenSchema from "../../app/configs/children.schema.json";
import { NavigationClassNameContract } from "./navigation.style";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { TreeNavigation } from "./";

const childOptions: ChildOptionItem[] = [
    {
        component: null,
        schema: noChildrenSchema,
    },
    {
        component: null,
        schema: childrenSchema,
    },
];

const standardData: any = {
    children: [
        {
            id: childOptions[0].schema.id,
            props: {},
        },
        {
            id: childOptions[1].schema.id,
            props: {
                children: [
                    {
                        id: childOptions[0].schema.id,
                        props: {},
                    },
                    {
                        id: childOptions[0].schema.id,
                        props: {},
                    },
                ],
            },
        },
        {
            id: childOptions[1].schema.id,
            props: {
                children: {
                    id: childOptions[0].schema.id,
                    props: {},
                },
            },
        },
    ],
};

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const navigationProps: NavigationProps = {
    data: {},
    schema: childOptions[1].schema,
    childOptions,
    managedClasses: {},
};
const managedClasses: NavigationClassNameContract = {
    navigation: "navigation-class",
    navigation_item: "navigation_item-class",
    navigation_itemLink: "navigation_itemLink-class",
    navigation_itemLink__active: "navigation_itemLink__active-class",
    navigation_itemExpandListTrigger: "navigation_itemExpandListTrigger-class",
    navigation_itemExpandListTrigger__active:
        "navigation_itemExpandListTrigger__active-class",
    navigation_itemList: "navigation_itemList-class",
};
const treeItemSelector: string = "[role='treeitem']";
const treeItemEndPointSelector: string = `a${treeItemSelector}`;
const treeItemExpandListTriggerSelector: string = `div${treeItemSelector} > span`;

describe("Navigation", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<Navigation {...navigationProps} />);
        }).not.toThrow();
    });
    test("should render a single item if a single child has been passed", () => {
        const props: NavigationProps = {
            ...navigationProps,
            data: {
                children: {
                    id: childOptions[0].schema.id,
                    props: {},
                },
            },
            managedClasses,
        };

        const rendered: any = shallow(<Navigation {...props} />);
        const item: any = rendered.find(treeItemEndPointSelector);
        expect(item).toHaveLength(1);
        expect(rendered.find(treeItemExpandListTriggerSelector)).toHaveLength(1);
        expect(item.props().className).toEqual(managedClasses.navigation_itemLink);
        expect(item.props()["aria-level"]).toEqual(2);
        expect(item.props()["aria-setsize"]).toEqual(1);
        expect(item.props()["aria-posinset"]).toEqual(1);
    });
    test("should render multiple items if multiple children have been passed", () => {
        const props: NavigationProps = {
            ...navigationProps,
            data: {
                children: [
                    {
                        id: childOptions[0].schema.id,
                        props: {},
                    },
                    {
                        id: childOptions[0].schema.id,
                        props: {},
                    },
                ],
            },
            managedClasses,
        };

        const rendered: any = shallow(<Navigation {...props} />);
        const item: any = rendered.find(treeItemEndPointSelector);
        expect(item).toHaveLength(2);
        expect(rendered.find(treeItemExpandListTriggerSelector)).toHaveLength(1);
        expect(item.at(0).props().className).toEqual(managedClasses.navigation_itemLink);
        expect(item.at(0).props()["aria-level"]).toEqual(2);
        expect(item.at(0).props()["aria-setsize"]).toEqual(2);
        expect(item.at(0).props()["aria-posinset"]).toEqual(1);
        expect(item.at(1).props().className).toEqual(managedClasses.navigation_itemLink);
        expect(item.at(1).props()["aria-level"]).toEqual(2);
        expect(item.at(1).props()["aria-setsize"]).toEqual(2);
        expect(item.at(1).props()["aria-posinset"]).toEqual(2);
    });
    test("should render a nested item if nested children have been passed", () => {
        const props: NavigationProps = {
            ...navigationProps,
            data: {
                children: {
                    id: childOptions[1].schema.id,
                    props: {
                        children: {
                            id: childOptions[0].schema.id,
                            props: {},
                        },
                    },
                },
            },
            managedClasses,
        };

        const rendered: any = shallow(<Navigation {...props} />);
        const linkItem: any = rendered.find(treeItemEndPointSelector);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector).at(1);

        expect(triggerItem).toHaveLength(1);
        expect(triggerItem.props().className).toEqual(
            managedClasses.navigation_itemExpandListTrigger
        );
        expect(triggerItem.parent().props()["aria-level"]).toEqual(2);
        expect(triggerItem.parent().props()["aria-setsize"]).toEqual(1);
        expect(triggerItem.parent().props()["aria-posinset"]).toEqual(1);
        expect(linkItem).toHaveLength(1);
        expect(linkItem.props().className).toEqual(managedClasses.navigation_itemLink);
        expect(linkItem.props()["aria-level"]).toEqual(3);
        expect(linkItem.props()["aria-setsize"]).toEqual(1);
        expect(linkItem.props()["aria-posinset"]).toEqual(1);
    });
    test("should render multiple nested items if multiple nested children have been passed", () => {
        const props: NavigationProps = {
            ...navigationProps,
            data: {
                children: {
                    id: childOptions[1].schema.id,
                    props: {
                        children: [
                            {
                                id: childOptions[0].schema.id,
                                props: {},
                            },
                            {
                                id: childOptions[0].schema.id,
                                props: {},
                            },
                        ],
                    },
                },
            },
            managedClasses,
        };

        const rendered: any = shallow(<Navigation {...props} />);
        const linkItem: any = rendered.find(treeItemEndPointSelector);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector).at(1);

        expect(triggerItem).toHaveLength(1);
        expect(triggerItem.props().className).toEqual(
            managedClasses.navigation_itemExpandListTrigger
        );
        expect(triggerItem.parent().props()["aria-level"]).toEqual(2);
        expect(triggerItem.parent().props()["aria-setsize"]).toEqual(1);
        expect(triggerItem.parent().props()["aria-posinset"]).toEqual(1);
        expect(linkItem).toHaveLength(2);
        expect(linkItem.at(0).props().className).toEqual(
            managedClasses.navigation_itemLink
        );
        expect(linkItem.at(0).props()["aria-level"]).toEqual(3);
        expect(linkItem.at(0).props()["aria-setsize"]).toEqual(2);
        expect(linkItem.at(0).props()["aria-posinset"]).toEqual(1);
        expect(linkItem.at(1).props().className).toEqual(
            managedClasses.navigation_itemLink
        );
        expect(linkItem.at(1).props()["aria-level"]).toEqual(3);
        expect(linkItem.at(1).props()["aria-setsize"]).toEqual(2);
        expect(linkItem.at(1).props()["aria-posinset"]).toEqual(2);
    });
    test("should render multiple items if multiple children with nested children have been passed", () => {
        const props: NavigationProps = {
            ...navigationProps,
            data: {
                children: [
                    {
                        id: childOptions[1].schema.id,
                        props: {
                            children: [
                                {
                                    id: childOptions[0].schema.id,
                                    props: {},
                                },
                                {
                                    id: childOptions[0].schema.id,
                                    props: {},
                                },
                            ],
                        },
                    },
                    {
                        id: childOptions[1].schema.id,
                        props: {
                            children: {
                                id: childOptions[0].schema.id,
                                props: {},
                            },
                        },
                    },
                ],
            },
            managedClasses,
        };

        const rendered: any = shallow(<Navigation {...props} />);
        const linkItem: any = rendered.find(treeItemEndPointSelector);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        expect(triggerItem).toHaveLength(3);
        expect(
            triggerItem
                .at(1)
                .parent()
                .props()["aria-level"]
        ).toEqual(2);
        expect(
            triggerItem
                .at(1)
                .parent()
                .props()["aria-setsize"]
        ).toEqual(2);
        expect(
            triggerItem
                .at(1)
                .parent()
                .props()["aria-posinset"]
        ).toEqual(1);
        expect(
            triggerItem
                .at(2)
                .parent()
                .props()["aria-level"]
        ).toEqual(2);
        expect(
            triggerItem
                .at(2)
                .parent()
                .props()["aria-setsize"]
        ).toEqual(2);
        expect(
            triggerItem
                .at(2)
                .parent()
                .props()["aria-posinset"]
        ).toEqual(2);
        expect(linkItem).toHaveLength(3);
        expect(linkItem.at(0).props()["aria-level"]).toEqual(3);
        expect(linkItem.at(0).props()["aria-setsize"]).toEqual(2);
        expect(linkItem.at(0).props()["aria-posinset"]).toEqual(1);
        expect(linkItem.at(1).props()["aria-level"]).toEqual(3);
        expect(linkItem.at(1).props()["aria-setsize"]).toEqual(2);
        expect(linkItem.at(1).props()["aria-posinset"]).toEqual(2);
        expect(linkItem.at(2).props()["aria-level"]).toEqual(3);
        expect(linkItem.at(2).props()["aria-setsize"]).toEqual(1);
        expect(linkItem.at(2).props()["aria-posinset"]).toEqual(1);
    });
    test("should fire a callback when a link has been clicked", () => {
        const onLocationUpdate: any = jest.fn();
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
            onLocationUpdate,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const linkItem: any = rendered.find(treeItemEndPointSelector);

        linkItem.at(0).simulate("click");

        expect(onLocationUpdate).toHaveBeenCalled();
        expect(onLocationUpdate.mock.calls[0][0]).toEqual(
            linkItem.at(0).props()["data-location"]
        );
    });
    test("should fire a callback when a list trigger has been clicked", () => {
        const onLocationUpdate: any = jest.fn();
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
            onLocationUpdate,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        triggerItem.at(0).simulate("click");

        expect(onLocationUpdate).toHaveBeenCalled();
        expect(onLocationUpdate.mock.calls[0][0]).toEqual(
            triggerItem.at(0).props()["data-location"]
        );
    });
    test("should add an active class on a link when it has been clicked", () => {
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const linkItem: any = rendered.find(treeItemEndPointSelector);

        expect(linkItem.at(0).props().className).toEqual(
            managedClasses.navigation_itemLink
        );

        linkItem.at(0).simulate("click");

        expect(
            rendered
                .find(treeItemEndPointSelector)
                .at(0)
                .props().className
        ).toEqual(
            `${managedClasses.navigation_itemLink} ${
                managedClasses.navigation_itemLink__active
            }`
        );
    });
    test("should add an active class on a list trigger when it has been clicked", () => {
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        expect(triggerItem.at(0).props().className).toEqual(
            managedClasses.navigation_itemExpandListTrigger
        );

        triggerItem.at(0).simulate("click");

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .props().className
        ).toEqual(
            `${managedClasses.navigation_itemExpandListTrigger} ${
                managedClasses.navigation_itemExpandListTrigger__active
            }`
        );
    });
    test("should expand a collapsed list if a list trigger has been clicked", () => {
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        expect(
            triggerItem
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(false);

        triggerItem.at(0).simulate("click");

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(true);
    });
    test("should collapse an expanded list if a list trigger has been clicked", () => {
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        triggerItem.at(0).simulate("click");

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(true);

        triggerItem.at(0).simulate("click");

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(false);
    });
    test("should expand a collapsed list if the enter key has been pressed on the list trigger", () => {
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        expect(
            triggerItem
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(false);

        triggerItem.at(0).simulate("keyup", { keyCode: KeyCodes.enter });

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(true);
    });
    test("should collapse an expanded list if the enter key has been pressed on the list trigger", () => {
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        triggerItem.at(0).simulate("keyup", { keyCode: KeyCodes.enter });

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(true);

        triggerItem.at(0).simulate("keyup", { keyCode: KeyCodes.enter });

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(false);
    });
    test("should expand a collapsed list if the space key has been pressed on the list trigger", () => {
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        expect(
            triggerItem
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(false);

        triggerItem.at(0).simulate("keyup", { keyCode: KeyCodes.space });

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(true);
    });
    test("should collapse an expanded list if the space key has been pressed on the list trigger", () => {
        const props: any = {
            ...navigationProps,
            data: standardData,
            managedClasses,
        };
        const rendered: any = mount(<Navigation {...props} />);
        const triggerItem: any = rendered.find(treeItemExpandListTriggerSelector);

        triggerItem.at(0).simulate("keyup", { keyCode: KeyCodes.space });

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(true);

        triggerItem.at(0).simulate("keyup", { keyCode: KeyCodes.space });

        expect(
            rendered
                .find(treeItemExpandListTriggerSelector)
                .at(0)
                .parent()
                .props()["aria-expanded"]
        ).toEqual(false);
    });
    test("should update the state with the `dataLocation` prop if it has been passed", () => {
        const props: NavigationProps = {
            ...navigationProps,
            data: {
                children: {
                    id: childOptions[0].schema.id,
                    props: {},
                },
            },
            dataLocation: "",
            managedClasses,
        };

        const rendered: any = shallow(<Navigation {...props} />);
        expect(rendered.state().activeItem).toEqual("");
        rendered.setProps({ ...props, dataLocation: "children" });
        expect(rendered.state().activeItem).toEqual("children");
    });
    test("should update the state with the openItems if the `dataLocation` prop is updated", () => {
        const props: NavigationProps = {
            ...navigationProps,
            data: {
                children: {
                    id: childOptions[0].schema.id,
                    props: {},
                },
            },
            dataLocation: "",
            managedClasses,
        };

        const rendered: any = shallow(<Navigation {...props} />);
        expect(rendered.state().openItems).toEqual([""]);
        rendered.setProps({ ...props, dataLocation: "children" });
        expect(rendered.state().openItems).toEqual(["", "children"]);
    });
    test("should update the navigation if the `data` prop has been updated", () => {
        const props: NavigationProps = {
            ...navigationProps,
            data: {
                children: {
                    id: childOptions[0].schema.id,
                    props: {},
                },
            },
            managedClasses,
        };

        const rendered: any = shallow(<Navigation {...props} />);
        const initialNavigation: TreeNavigation = rendered.state().navigation;
        rendered.setProps({
            ...props,
            data: {
                children: [
                    {
                        id: childOptions[0].schema.id,
                        props: {},
                    },
                    "Foo",
                ],
            },
        });
        const updatedNavigation: TreeNavigation = rendered.state().navigation;
        expect(updatedNavigation).not.toEqual(initialNavigation);
    });
});
