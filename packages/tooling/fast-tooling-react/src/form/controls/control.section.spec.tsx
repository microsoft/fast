import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import StyledSectionControl, { SectionControl } from "./control.section";
import {
    SectionControlClassNameContract,
    SectionControlProps,
} from "./control.section.props";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { controls } from "./utilities/control-switch.spec";
import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    ControlType,
    DisplayControl,
    NumberFieldControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
} from "../index";
import { DataType } from "@microsoft/fast-tooling";
import defaultStrings from "../form.strings";

const TestSectionControl: any = (
    props: React.PropsWithChildren<SectionControlProps>
): React.ReactElement => {
    return (
        <DndProvider backend={HTML5Backend}>
            <StyledSectionControl {...props} />
        </DndProvider>
    );
};

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const sectionControlProps: SectionControlProps = {
    type: ControlType.section,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    dataDictionary: [
        {
            "": {
                schemaId: "",
                data: {},
            },
        },
        "",
    ],
    navigation: {
        "": {
            self: "",
            parent: null,
            relativeDataLocation: "",
            schemaLocation: "",
            schema: {},
            disabled: false,
            data: void 0,
            text: "foo",
            type: DataType.object,
            items: [],
        },
    },
    schemaLocation: "",
    controls,
    schema: {},
    schemaDictionary: {},
    disabled: false,
    value: {},
    untitled: "",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    validationErrors: null,
    default: {},
    controlComponents: {
        [ControlType.array]: ArrayControl,
        [ControlType.button]: ButtonControl,
        [ControlType.checkbox]: CheckboxControl,
        [ControlType.display]: DisplayControl,
        [ControlType.numberField]: NumberFieldControl,
        [ControlType.sectionLink]: SectionLinkControl,
        [ControlType.section]: SectionControl,
        [ControlType.select]: SelectControl,
        [ControlType.textarea]: TextareaControl,
    },
    elementRef: null,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    required: false,
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
    categories: {},
};

const managedClasses: SectionControlClassNameContract = {
    sectionControl: "sectionControl",
    sectionControl__disabled: "sectionControl__disabeld",
};

describe("SectionControl", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<TestSectionControl {...sectionControlProps} />);
        }).not.toThrow();
    });
    test("should contain a root level fieldset element", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find("fieldset").prop("className")).toEqual(
            managedClasses.sectionControl
        );
    });
    test("should not be disabled if the disabled prop has not been passed", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionControl}`).prop("disabled")
        ).toEqual(undefined);
    });
    test("should not add a disabled class if the disabled prop is not passed", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.sectionControl__disabled}`)).toHaveLength(
            0
        );
    });
    test("should not be disabled if the disabled prop is false", () => {
        const schema: any = {
            type: "object",
            disabled: false,
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionControl}`).prop("disabled")
        ).toEqual(false);
    });
    test("should not add the disabled class if the disabled prop is false", () => {
        const schema: any = {
            type: "object",
            disabled: false,
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.sectionControl__disabled}`)).toHaveLength(
            0
        );
    });
    test("should be disabled if the disabled prop is true", () => {
        const schema: any = {
            type: "object",
            disabled: true,
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionControl}`).prop("disabled")
        ).toEqual(true);
    });
    test("should add a disabled class if the disabled prop is true", () => {
        const schema: any = {
            type: "object",
            disabled: true,
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.sectionControl__disabled}`)).toHaveLength(
            1
        );
    });
    test("should show an invalid message if validation errors have been passed", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
            required: ["foo"],
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
                validationErrors={[
                    {
                        dataLocation: "foo",
                        invalidMessage: "is required",
                    },
                ]}
            />
        );

        expect(rendered.find("SectionValidation")).toHaveLength(1);
    });
    test("should not show an invalid message if no validation errors have been passed", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
                value={{}}
                validationErrors={[]}
            />
        );

        expect(rendered.find("SectionValidation")).toHaveLength(0);
    });
    test("should show categories and categorize items if categories have been passed", () => {
        const schema: any = {
            id: "",
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
                bar: {
                    type: "string",
                },
                bat: {
                    type: "string",
                },
            },
        };

        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
                validationErrors={[]}
                categories={{
                    "": {
                        "": [
                            {
                                title: "category title",
                                dataLocations: ["foo", "baz"],
                            },
                        ],
                    },
                }}
                navigation={{
                    "": {
                        self: "",
                        parent: null,
                        relativeDataLocation: "",
                        schemaLocation: "",
                        schema,
                        disabled: false,
                        data: {},
                        text: "foo",
                        type: DataType.object,
                        items: ["foo", "bar", "bat"],
                    },
                    foo: {
                        self: "foo",
                        parent: "",
                        relativeDataLocation: "foo",
                        schemaLocation: "properties.foo",
                        schema: schema.properties.foo,
                        disabled: false,
                        data: undefined,
                        text: "foo",
                        type: DataType.string,
                        items: [],
                    },
                    bar: {
                        self: "bar",
                        parent: "",
                        relativeDataLocation: "bar",
                        schemaLocation: "properties.bar",
                        schema: schema.properties.bar,
                        disabled: false,
                        data: undefined,
                        text: "bar",
                        type: DataType.string,
                        items: [],
                    },
                    bat: {
                        self: "bat",
                        parent: "",
                        relativeDataLocation: "bat",
                        schemaLocation: "properties.bat",
                        schema: schema.properties.bat,
                        disabled: false,
                        data: undefined,
                        text: "bat",
                        type: DataType.string,
                        items: [],
                    },
                }}
            />
        );

        expect(rendered.find("TextareaControl")).toHaveLength(3);
        expect(rendered.find("legend").at(0).text()).toEqual("category title");
    });
});
