import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import ControlTemplateUtilities from "./template.control.utilities";
import { BadgeType } from "./types";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

class TestClass extends ControlTemplateUtilities<{}, {}> {}

const config: any = {
    index: 0,
    dataLocation: "",
    schemaLocation: "",
    data: "foo",
    schema: {},
    required: false,
    label: "",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    invalidMessage: "",
};

describe("ControlPlugin", () => {
    test("should render a soft remove trigger if required is false and softRemove is true", () => {
        const testClass: TestClass = new TestClass({
            ...config,
            softRemove: true,
        });

        const renderSoftRemove: any = mount(
            testClass.renderSoftRemove("foo") as JSX.Element
        );

        expect(renderSoftRemove.find("SoftRemove")).toHaveLength(1);
    });
    test("should render a badge if the badge prop is passed", () => {
        const testClass: TestClass = new TestClass({
            ...config,
            badge: BadgeType.info,
        });

        const renderBadge: any = mount(testClass.renderBadge("foo") as JSX.Element);

        expect(renderBadge.find("Badge")).toHaveLength(1);
    });
    test("should not render a badge if the badge prop is passed", () => {
        const testClass: TestClass = new TestClass({
            ...config,
        });

        const renderBadge: any = testClass.renderBadge("foo");

        expect(renderBadge).toEqual(void 0);
    });
    test("should render a const value trigger if the const is passed and data is not equal to const", () => {
        const testClass: TestClass = new TestClass({
            ...config,
            const: "bar",
        });

        const renderConstTrigger: any = mount(
            testClass.renderConstValueIndicator("foo") as JSX.Element
        );

        expect(renderConstTrigger.find("ConstValue")).toHaveLength(1);
    });
    test("sshould not render a const value trigger if the const is the same as the data", () => {
        const testClass: TestClass = new TestClass({
            ...config,
            const: "bar",
            data: "bar",
        });

        const renderConstTrigger: any = testClass.renderConstValueIndicator("foo");

        expect(renderConstTrigger).toEqual(void 0);
    });
    test("should render a default value trigger if the default is passed and data is not equal to default", () => {
        const testClass: TestClass = new TestClass({
            ...config,
            data: {
                foo: "hello",
            },
            default: {
                foo: "world",
            },
        });

        const renderDefaultTrigger: any = mount(
            testClass.renderDefaultValueIndicator("foo") as JSX.Element
        );

        expect(renderDefaultTrigger.find("DefaultValue")).toHaveLength(1);
    });
    test("should not render a default value trigger if the default is passed and data is equal to default", () => {
        const testClass: TestClass = new TestClass({
            ...config,
            data: {
                foo: "bar",
            },
            default: {
                foo: "bar",
            },
        });

        expect(testClass.renderDefaultValueIndicator("foo")).toEqual(void 0);
    });
    test("should not render a default indicator if data is the same as default", () => {
        const testClass: TestClass = new TestClass({
            ...config,
            data: "bar",
            default: "bar",
        });

        const renderDefaultTrigger: any = testClass.renderDefaultValueIndicator("foo");

        expect(renderDefaultTrigger).toEqual(void 0);
    });
    test("should render an invalid message if an invalid message is passed and displayValidationInline prop is true", () => {
        const className: string = "bat";
        const testClass: TestClass = new TestClass({
            ...config,
            invalidMessage: "bar",
            displayValidationInline: true,
        });

        const renderInvalidMessage: any = mount(
            testClass.renderInvalidMessage(className) as JSX.Element
        );

        expect(renderInvalidMessage.find(`.${className}`)).toHaveLength(1);
    });
    test("should not render an invalid message if the invalid message is an empty string of displayValidationInline prop is false", () => {
        const className: string = "bat";
        const testClass1: TestClass = new TestClass({
            ...config,
            invalidMessage: "",
            displayValidationInline: true,
        });

        const renderInvalidMessage1: any = testClass1.renderInvalidMessage(className);

        expect(renderInvalidMessage1).toEqual(void 0);

        const testClass2: TestClass = new TestClass({
            ...config,
            invalidMessage: "bat",
            displayValidationInline: false,
        });

        const renderInvalidMessage2: any = testClass2.renderInvalidMessage(className);

        expect(renderInvalidMessage2).toEqual(void 0);
    });
});
