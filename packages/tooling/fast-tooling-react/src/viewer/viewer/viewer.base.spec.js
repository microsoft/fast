import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { Viewer } from "./viewer.base";
import { ResizeHandleLocation } from "./viewer.props";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const props = {
    iframeSrc: "/test",
    messageSystem: void 0,
};
describe("Viewer", () => {
    const managedClasses = {
        viewer: "viewer",
    };
    test("should create an iframe", () => {
        const rendered = mount(<Viewer managedClasses={managedClasses} {...props} />);
        expect(rendered.find("iframe").length).toBe(1);
    });
    test("should use the `iframeSrc` prop as the iframe src attribute", () => {
        const rendered = mount(<Viewer managedClasses={managedClasses} {...props} />);
        expect(rendered.find("iframe").prop("src")).toBe(props.iframeSrc);
    });
    test("should set the width if the `width` prop is set", () => {
        const rendered = mount(
            <Viewer managedClasses={managedClasses} width={800} {...props} />
        );
        expect(rendered.find("div").last().prop("style")).toEqual({ width: "800px" });
    });
    test("should set the height if the `height` prop is set", () => {
        const rendered = mount(
            <Viewer managedClasses={managedClasses} height={600} {...props} />
        );
        expect(rendered.find("div").last().prop("style")).toEqual({ height: "600px" });
    });
    test("should create a series of responsive buttons if the `responsive` prop is true", () => {
        const renderedWithResponsive = mount(
            <Viewer managedClasses={managedClasses} responsive={true} {...props} />
        );
        const renderedWithoutResponsive = mount(
            <Viewer managedClasses={managedClasses} {...props} />
        );
        expect(renderedWithResponsive.find("button").length).toBe(5);
        expect(renderedWithoutResponsive.find("button").length).toBe(0);
    });
    test("should fire the `onUpdateHeight` callback if the responsive buttons are dragged", () => {
        jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
            callback();
        });
        const updateHeightCallback = jest.fn(function (height) {
            expect(height).toEqual(400);
        });
        const rendered = mount(
            <Viewer
                managedClasses={managedClasses}
                {...props}
                height={500}
                responsive={true}
                onUpdateHeight={updateHeightCallback}
            />
        );
        const mouseDownEvent = {
            button: 0,
            pageX: 300,
            pageY: 300,
        };
        const mouseMoveEvent = {
            button: 0,
            pageX: 200,
            pageY: 200,
        };
        rendered.instance().handleMouseDown(ResizeHandleLocation.bottom)(mouseDownEvent);
        rendered.instance().handleMouseMove(mouseMoveEvent);
        expect(updateHeightCallback).toHaveBeenCalled();
    });
    test("should fire the `onUpdateWidth` callback if the responsive buttons are dragged", () => {
        jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
            callback();
        });
        const updateWidthCallback = jest.fn(function (width) {
            expect(width).toEqual(700);
        });
        const rendered = mount(
            <Viewer
                managedClasses={managedClasses}
                {...props}
                width={500}
                responsive={true}
                onUpdateWidth={updateWidthCallback}
            />
        );
        const mouseDownEvent = {
            button: 0,
            pageX: 300,
            pageY: 300,
        };
        const mouseMoveEvent = {
            button: 0,
            pageX: 200,
            pageY: 200,
        };
        rendered.instance().handleMouseDown(ResizeHandleLocation.left)(mouseDownEvent);
        rendered.instance().handleMouseMove(mouseMoveEvent);
        expect(updateWidthCallback).toHaveBeenCalled();
    });
});
