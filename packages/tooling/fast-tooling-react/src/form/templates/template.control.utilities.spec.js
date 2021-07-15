import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import ControlTemplateUtilities from "./template.control.utilities";
import { BadgeType } from "./types";
import defaultStrings from "../form.strings";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
class TestClass extends ControlTemplateUtilities {}
const config = {
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
    strings: defaultStrings,
};
describe("ControlPlugin", () => {
    test("should render a soft remove trigger if required is false and softRemove is true", () => {
        const testClass = new TestClass(
            Object.assign(Object.assign({}, config), { softRemove: true })
        );
        const renderSoftRemove = mount(testClass.renderSoftRemove("foo"));
        expect(renderSoftRemove.find("SoftRemove")).toHaveLength(1);
    });
    test("should render a badge if the badge prop is passed", () => {
        const testClass = new TestClass(
            Object.assign(Object.assign({}, config), { badge: BadgeType.info })
        );
        const renderBadge = mount(testClass.renderBadge("foo"));
        expect(renderBadge.find("Badge")).toHaveLength(1);
    });
    test("should not render a badge if the badge prop is passed", () => {
        const testClass = new TestClass(Object.assign({}, config));
        const renderBadge = testClass.renderBadge("foo");
        expect(renderBadge).toEqual(void 0);
    });
    test("should render a const value trigger if the const is passed and data is not equal to const", () => {
        const testClass = new TestClass(
            Object.assign(Object.assign({}, config), { const: "bar" })
        );
        const renderConstTrigger = mount(testClass.renderConstValueIndicator("foo"));
        expect(renderConstTrigger.find("ConstValue")).toHaveLength(1);
    });
    test("sshould not render a const value trigger if the const is the same as the data", () => {
        const testClass = new TestClass(
            Object.assign(Object.assign({}, config), { const: "bar", data: "bar" })
        );
        const renderConstTrigger = testClass.renderConstValueIndicator("foo");
        expect(renderConstTrigger).toEqual(void 0);
    });
    test("should render a default value trigger if the default is passed and data is not equal to default", () => {
        const testClass = new TestClass(
            Object.assign(Object.assign({}, config), {
                data: {
                    foo: "hello",
                },
                default: {
                    foo: "world",
                },
            })
        );
        const renderDefaultTrigger = mount(testClass.renderDefaultValueIndicator("foo"));
        expect(renderDefaultTrigger.find("DefaultValue")).toHaveLength(1);
    });
    test("should not render a default value trigger if the default is passed and data is equal to default", () => {
        const testClass = new TestClass(
            Object.assign(Object.assign({}, config), {
                data: {
                    foo: "bar",
                },
                default: {
                    foo: "bar",
                },
            })
        );
        expect(testClass.renderDefaultValueIndicator("foo")).toEqual(void 0);
    });
    test("should not render a default indicator if data is the same as default", () => {
        const testClass = new TestClass(
            Object.assign(Object.assign({}, config), { data: "bar", default: "bar" })
        );
        const renderDefaultTrigger = testClass.renderDefaultValueIndicator("foo");
        expect(renderDefaultTrigger).toEqual(void 0);
    });
    test("should render an invalid message if an invalid message is passed and displayValidationInline prop is true", () => {
        const className = "bat";
        const testClass = new TestClass(
            Object.assign(Object.assign({}, config), {
                invalidMessage: "bar",
                displayValidationInline: true,
            })
        );
        const renderInvalidMessage = mount(testClass.renderInvalidMessage(className));
        expect(renderInvalidMessage.find(`.${className}`)).toHaveLength(1);
    });
    test("should not render an invalid message if the invalid message is an empty string of displayValidationInline prop is false", () => {
        const className = "bat";
        const testClass1 = new TestClass(
            Object.assign(Object.assign({}, config), {
                invalidMessage: "",
                displayValidationInline: true,
            })
        );
        const renderInvalidMessage1 = testClass1.renderInvalidMessage(className);
        expect(renderInvalidMessage1).toEqual(void 0);
        const testClass2 = new TestClass(
            Object.assign(Object.assign({}, config), {
                invalidMessage: "bat",
                displayValidationInline: false,
            })
        );
        const renderInvalidMessage2 = testClass2.renderInvalidMessage(className);
        expect(renderInvalidMessage2).toEqual(void 0);
    });
});
