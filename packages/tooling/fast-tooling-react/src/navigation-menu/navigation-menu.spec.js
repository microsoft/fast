import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import NavigationMenu from "./navigation-menu";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const managedClasses = {
    navigationMenu: "navigationMenu-class",
    navigationMenuItem: "navigationMenuItem-class",
    navigationMenuItem_list: "navigationMenuItem_list-class",
    navigationMenuItem_listItem: "navigationMenuItem_listItem-class",
    navigationMenuItem_listItem__active: "navigationMenuItem_listItem__active-class",
    navigationMenuItem_list__expanded: "navigationMenuItem_list__expanded-class",
};
function getMenuItemLeaf(displayName, location) {
    return {
        displayName,
        location,
    };
}
function getMenuItemTree(displayName, location) {
    return {
        displayName,
        location,
        items: [
            getMenuItemLeaf("foo", "foo-location"),
            getMenuItemLeaf("bar", "bar-location"),
        ],
    };
}
const navigationMenuPropsShallow = {
    menu: [
        getMenuItemLeaf("foo", "foo-location"),
        getMenuItemLeaf("bar", "bar-location"),
    ],
};
const navigationMenuPropsNested = {
    menu: [getMenuItemTree("foo", "foo-location")],
};
describe("NavigationMenu", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<NavigationMenu {...navigationMenuPropsShallow} />);
        }).not.toThrow();
    });
    test("should include an HTML nav element", () => {
        const rendered = mount(<NavigationMenu {...navigationMenuPropsShallow} />);
        expect(rendered.find("nav")).toHaveLength(1);
    });
    test("should show items with `displayName` text", () => {
        const rendered = mount(<NavigationMenu {...navigationMenuPropsShallow} />);
        const menuItems = rendered.find("[role='menuitem']");
        expect(menuItems.at(0).text()).toEqual("foo");
        expect(menuItems.at(1).text()).toEqual("bar");
    });
    test("should show items as anchors if the `onLocationUpdate` callback has not been included", () => {
        const rendered = mount(<NavigationMenu {...navigationMenuPropsShallow} />);
        expect(rendered.find("a")).toHaveLength(2);
    });
    test("should show items as buttons if the `onLocationUpdate` callback has been included", () => {
        const callback = jest.fn();
        const rendered = mount(
            <NavigationMenu {...navigationMenuPropsShallow} onLocationUpdate={callback} />
        );
        expect(rendered.find("button")).toHaveLength(2);
    });
    test("should show items as buttons if the item contains its own items", () => {
        const rendered = mount(<NavigationMenu {...navigationMenuPropsNested} />);
        expect(rendered.find("button")).toHaveLength(1);
    });
    test("should use aria-controls on a button with reference to the associated menu id", () => {
        const rendered = mount(<NavigationMenu {...navigationMenuPropsNested} />);
        const buttonAriaControls = rendered.find("button").prop("aria-controls");
        const subMenuId = rendered.find("[role='menu']").prop("id");
        expect(buttonAriaControls).toEqual(subMenuId);
    });
    test("should use aria-expanded on a button when it has been clicked", () => {
        const rendered = mount(<NavigationMenu {...navigationMenuPropsNested} />);
        expect(rendered.find("button").prop("aria-expanded")).toBe(false);
        rendered.find("button").simulate("click");
        expect(rendered.find("button").prop("aria-expanded")).toBe(true);
        rendered.find("button").simulate("click");
        expect(rendered.find("button").prop("aria-expanded")).toBe(false);
    });
    test("should add an expanded class if a items button has been clicked", () => {
        const rendered = mount(
            <NavigationMenu
                {...navigationMenuPropsNested}
                managedClasses={managedClasses}
            />
        );
        expect(
            rendered
                .find("[role='menu']")
                .prop("className")
                .includes(managedClasses.navigationMenuItem_list__expanded)
        ).toBe(false);
        rendered.find("button").simulate("click");
        expect(
            rendered
                .find("[role='menu']")
                .prop("className")
                .includes(managedClasses.navigationMenuItem_list__expanded)
        ).toBe(true);
    });
    test("should fire the `onLocationUpdate` callback if it has been provided and a location is available for the item", () => {
        const callback = jest.fn();
        const rendered = mount(
            <NavigationMenu {...navigationMenuPropsShallow} onLocationUpdate={callback} />
        );
        expect(callback).toBeCalledTimes(0);
        rendered.find("button").at(0).simulate("click");
        expect(callback).toBeCalledTimes(1);
        expect(callback.mock.calls[0][0]).toBe("foo-location");
    });
    test("should expand all of the menus if the `expanded` prop is true", () => {
        const rendered = mount(
            <NavigationMenu {...navigationMenuPropsNested} expanded={true} />
        );
        expect(rendered.find("button").prop("aria-expanded")).toBe(true);
    });
    test("should collapse all of the menus if the `expanded` prop is false", () => {
        const rendered = mount(
            <NavigationMenu {...navigationMenuPropsNested} expanded={false} />
        );
        expect(rendered.find("button").prop("aria-expanded")).toBe(false);
    });
    test("should add a class to an item with a location matching `activeLocation`", () => {
        const rendered = mount(
            <NavigationMenu
                {...navigationMenuPropsShallow}
                managedClasses={managedClasses}
                activeLocation={"foo-location"}
            />
        );
        expect(
            rendered.find(`.${managedClasses.navigationMenuItem_listItem__active}`)
        ).toHaveLength(1);
    });
    test("should not add a class to an item with a location not matching `activeLocation`", () => {
        const rendered = mount(
            <NavigationMenu
                {...navigationMenuPropsShallow}
                managedClasses={managedClasses}
                activeLocation={"hello"}
            />
        );
        expect(
            rendered.find(`.${managedClasses.navigationMenuItem_listItem__active}`)
        ).toHaveLength(0);
    });
});
