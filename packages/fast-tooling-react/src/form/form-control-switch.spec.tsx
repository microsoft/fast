import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import FormControlSwitch, { FormControlSwitchProps } from "./form-control-switch";
import { ContextComponent, DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import oneOfSchema from "../__tests__/schemas/one-of.schema.json";
import numberFieldSchema from "../__tests__/schemas/number-field.schema.json";
import checkboxSchema from "../__tests__/schemas/checkbox.schema.json";
import objectSchema from "../__tests__/schemas/objects.schema.json";
import arraySchema from "../__tests__/schemas/arrays.schema.json";
import childrenSchema from "../__tests__/schemas/children.schema.json";
import textareaSchema from "../__tests__/schemas/textarea.schema.json";
import {
    ArrayControlConfig,
    BadgeType,
    ChildrenControlConfig,
    CommonControlConfig,
    ControlConfig,
    ControlContext,
    ListControlConfig,
    NumberFieldTypeControlConfig,
    SectionLinkControlConfig,
    SingleLineControlPlugin,
    StandardControlPlugin,
    TextareaControlConfig,
} from "./templates";
import {
    ArrayControl,
    ButtonControl,
    ChildrenControl,
    NumberFieldControl,
    SelectControl,
    TextareaControl,
} from "./controls";
import { SectionLinkControl } from "./controls/control.section-link";
import { CheckboxControl } from "./controls/control.checkbox";
import { DisplayControl } from "./controls/control.display";
import { Controls } from "./form-section.props";
import { reactChildrenStringSchema } from "./controls/control.children.text";

const selectControl: StandardControlPlugin = new StandardControlPlugin({
    control: (config: ListControlConfig): React.ReactNode => {
        return <SelectControl {...config} />;
    },
});
const arrayControl: StandardControlPlugin = new StandardControlPlugin({
    context: ControlContext.fill,
    control: (config: ArrayControlConfig): React.ReactNode => {
        return <ArrayControl {...config} />;
    },
});
const childrenControl: StandardControlPlugin = new StandardControlPlugin({
    context: ControlContext.fill,
    control: (config: ChildrenControlConfig): React.ReactNode => {
        return <ChildrenControl {...config} />;
    },
});
const numberFieldControl: StandardControlPlugin = new StandardControlPlugin({
    control: (config: NumberFieldTypeControlConfig): React.ReactNode => {
        return <NumberFieldControl {...config} />;
    },
});
const checkboxControl: SingleLineControlPlugin = new SingleLineControlPlugin({
    control: (config: CommonControlConfig): React.ReactNode => {
        return <CheckboxControl {...config} />;
    },
});
const sectionLinkControl: StandardControlPlugin = new StandardControlPlugin({
    control: (config: SectionLinkControlConfig): React.ReactNode => {
        return <SectionLinkControl {...config} />;
    },
});
const textareaControl: StandardControlPlugin = new StandardControlPlugin({
    control: (config: TextareaControlConfig): React.ReactNode => {
        return <TextareaControl {...config} />;
    },
});
const displayControl: StandardControlPlugin = new StandardControlPlugin({
    control: (config: ControlConfig): React.ReactNode => {
        return <DisplayControl {...config} />;
    },
});
const buttonControl: StandardControlPlugin = new StandardControlPlugin({
    control: (config: ControlConfig): React.ReactNode => {
        return <ButtonControl {...config} />;
    },
});

export const controls: Controls = {
    button: buttonControl,
    array: arrayControl,
    checkbox: checkboxControl,
    children: childrenControl,
    display: displayControl,
    textarea: textareaControl,
    select: selectControl,
    sectionLink: sectionLinkControl,
    numberField: numberFieldControl,
};

const TestFormControlSwitch: typeof FormControlSwitch &
    ContextComponent<any> = DragDropContext(HTML5Backend)(FormControlSwitch);

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formControlSwitchProps: FormControlSwitchProps = {
    index: 0,
    controls,
    propertyName: "",
    label: "Label",
    schema: {},
    data: {},
    required: false,
    untitled: "",
    schemaLocation: "",
    dataLocation: "",
    childOptions: [],
    onUpdateSection: null,
    onChange: null,
    invalidMessage: "",
};

describe("FormControlSwitch", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<TestFormControlSwitch {...formControlSwitchProps} />);
        }).not.toThrow();
    });
    test("should NOT render any controls when the schema is false", () => {
        const rendered: any = mount(
            <TestFormControlSwitch {...formControlSwitchProps} schema={false} />
        );

        expect(rendered.html()).toEqual("");
    });
    test("should render a number field when a number type is available", () => {
        const rendered: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                schema={numberFieldSchema.properties.quantity}
                schemaLocation={"properties.quantity"}
                dataLocation={"quantity"}
                propertyName={"quantity"}
                data={30}
            />
        );

        expect(rendered.find("NumberFieldControl")).toHaveLength(1);
    });
    test("should render a textarea when a string type is available", () => {
        const rendered: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                schema={textareaSchema.properties.textWithDefault}
                schemaLocation={"properties.text"}
                dataLocation={"text"}
                propertyName={"text"}
                data={"Foo"}
            />
        );

        expect(rendered.find("TextareaControl")).toHaveLength(1);
    });
    test("should render a checkbox when a boolean type is available", () => {
        const rendered: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                schema={checkboxSchema.properties.toggle}
                schemaLocation={"properties.toggle"}
                dataLocation={"toggle"}
                propertyName={"toggle"}
                data={true}
            />
        );

        expect(rendered.find("CheckboxControl")).toHaveLength(1);
    });
    test("should render a link when an object type is available", () => {
        const rendered: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                schema={objectSchema.properties.objectNoRequired}
                schemaLocation={"properties.objectNoRequired"}
                dataLocation={"objectNoRequired"}
                propertyName={"objectNoRequired"}
                data={{}}
            />
        );

        expect(rendered.find("SectionLinkControl")).toHaveLength(1);
    });
    test("should render the array UI when an array type is available", () => {
        const rendered: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                schema={arraySchema.properties.strings}
                schemaLocation={"properties.strings"}
                dataLocation={"strings"}
                propertyName={"strings"}
                data={[]}
            />
        );

        expect(rendered.find("ArrayControl")).toHaveLength(1);
    });
    test("should render the children UI when a children type is available", () => {
        const rendered: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                schema={childrenSchema.reactProperties.children}
                schemaLocation={"reactProperties.children"}
                dataLocation={"children"}
                propertyName={"children"}
                data={[]}
            />
        );

        expect(rendered.find("ChildrenControl")).toHaveLength(1);
    });
    test("should render a select when enums are available", () => {
        const rendered: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                schema={textareaSchema.properties.tag}
                schemaLocation={"properties.tag"}
                dataLocation={"tag"}
                propertyName={"tag"}
                data={"span"}
            />
        );

        expect(rendered.find("SelectControl")).toHaveLength(1);
    });
    test("should restrict the child options if ids have been passed", () => {
        const renderedWithDefault: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                childOptions={[
                    {
                        component: null,
                        schema: objectSchema,
                    },
                    {
                        component: null,
                        schema: arraySchema,
                    },
                    {
                        component: null,
                        schema: childrenSchema,
                    },
                ]}
                schema={childrenSchema.reactProperties.children}
                schemaLocation={"reactProperties.children"}
                dataLocation={"children"}
                propertyName={"children"}
                data={[]}
            />
        );

        const renderedWithoutDefaultAndIds: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                childOptions={[
                    {
                        component: null,
                        schema: objectSchema,
                    },
                    {
                        component: null,
                        schema: arraySchema,
                    },
                    {
                        component: null,
                        schema: childrenSchema,
                    },
                ]}
                schema={
                    childrenSchema.reactProperties.restrictedChildrenWithReactDefaults
                }
                schemaLocation={"reactProperties.restrictedChildrenWithReactDefaults"}
                dataLocation={"restrictedChildrenWithReactDefaults"}
                propertyName={"restrictedChildrenWithReactDefaults"}
                data={[]}
            />
        );

        const renderedWithDefaultAndIds: any = mount(
            <TestFormControlSwitch
                {...formControlSwitchProps}
                childOptions={[
                    {
                        component: null,
                        schema: objectSchema,
                    },
                    {
                        component: null,
                        schema: arraySchema,
                    },
                    {
                        component: null,
                        schema: childrenSchema,
                    },
                ]}
                schema={childrenSchema.reactProperties.restrictedWithChildren}
                schemaLocation={"reactProperties.restrictedWithChildren"}
                dataLocation={"restrictedWithChildren"}
                propertyName={"restrictedWithChildren"}
                data={[]}
            />
        );

        expect(renderedWithDefault.find("li")).toHaveLength(4);
        expect(renderedWithoutDefaultAndIds.find("li")).toHaveLength(1);
        expect(renderedWithDefaultAndIds.find("li")).toHaveLength(3);
    });
    describe("should pass all config properties to the template", () => {
        describe("common properties", () => {
            test("dataLocation", () => {
                const dataLocation: string = "text";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={textareaSchema.properties.textWithDefault}
                        schemaLocation={"properties.text"}
                        dataLocation={dataLocation}
                        propertyName={"text"}
                        data={"Foo"}
                    />
                );

                expect(
                    rendered.find("StandardControlTemplate").prop("dataLocation")
                ).toEqual(dataLocation);
            });
            test("schemaLocation", () => {
                const schemaLocation: string = "properties.text";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={textareaSchema.properties.textWithDefault}
                        schemaLocation={schemaLocation}
                        dataLocation={"text"}
                        propertyName={"text"}
                        data={"Foo"}
                    />
                );

                expect(
                    rendered.find("StandardControlTemplate").prop("schemaLocation")
                ).toEqual(schemaLocation);
            });
            test("data", () => {
                const data: string = "Foo";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={textareaSchema.properties.textWithDefault}
                        schemaLocation={"properties.text"}
                        dataLocation={"text"}
                        propertyName={"text"}
                        data={data}
                    />
                );

                expect(rendered.find("StandardControlTemplate").prop("data")).toEqual(
                    data
                );
            });
            test("schema", () => {
                const schema: any = textareaSchema.properties.textWithDefault;
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={schema}
                        schemaLocation={"properties.text"}
                        dataLocation={"text"}
                        propertyName={"text"}
                        data={"Foo"}
                    />
                );

                expect(rendered.find("StandardControlTemplate").prop("schema")).toEqual(
                    schema
                );
                expect(rendered.find("TextareaControl").prop("schema")).toEqual(schema);
            });
            test("required", () => {
                const rendered: any = mount(
                    <TestFormControlSwitch {...formControlSwitchProps} required={true} />
                );

                expect(rendered.find("StandardControlTemplate").prop("required")).toEqual(
                    true
                );
            });
            test("label", () => {
                const label: string = "Foo";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={{
                            title: label,
                        }}
                    />
                );

                expect(rendered.find("StandardControlTemplate").prop("label")).toEqual(
                    label
                );
            });
            test("labelTooltip", () => {
                const labelTooltip: string = "Foo";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={{
                            description: labelTooltip,
                        }}
                    />
                );

                expect(
                    rendered.find("StandardControlTemplate").prop("labelTooltip")
                ).toEqual(labelTooltip);
            });
            test("disabled", () => {
                const disabled: boolean = true;
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={{
                            disabled,
                        }}
                    />
                );

                expect(rendered.find("StandardControlTemplate").prop("disabled")).toEqual(
                    disabled
                );
            });
            test("onChange", () => {
                const onChange: any = jest.fn();
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        onChange={onChange}
                    />
                );

                expect(rendered.find("StandardControlTemplate").prop("onChange")).toEqual(
                    onChange
                );
            });
            test("default", () => {
                const defaultValue: string = "Bar";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={{
                            default: defaultValue,
                        }}
                    />
                );

                expect(rendered.find("StandardControlTemplate").prop("default")).toEqual(
                    defaultValue
                );
            });
            test("const", () => {
                const constValue: string = "Bar";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={{
                            const: constValue,
                        }}
                    />
                );

                expect(rendered.find("StandardControlTemplate").prop("const")).toEqual(
                    constValue
                );
            });
            test("badge", () => {
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={{
                            badge: BadgeType.locked,
                        }}
                    />
                );

                expect(rendered.find("StandardControlTemplate").prop("badge")).toEqual(
                    BadgeType.locked
                );
            });
            test("badgeDescription", () => {
                const badgeDescription: string = "Foo";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        schema={{
                            badgeDescription,
                        }}
                    />
                );

                expect(
                    rendered.find("StandardControlTemplate").prop("badgeDescription")
                ).toEqual(badgeDescription);
            });
            test("invalidMessage", () => {
                const invalidMessage: string = "Foo";
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        invalidMessage={invalidMessage}
                    />
                );

                expect(
                    rendered.find("StandardControlTemplate").prop("invalidMessage")
                ).toEqual(invalidMessage);
            });
            test("displayValidationBrowserDefault", () => {
                const displayValidationBrowserDefault: boolean = true;
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        displayValidationBrowserDefault={displayValidationBrowserDefault}
                    />
                );

                expect(
                    rendered
                        .find("StandardControlTemplate")
                        .prop("displayValidationBrowserDefault")
                ).toEqual(displayValidationBrowserDefault);
            });
            test("displayValidationInline", () => {
                const displayValidationInline: boolean = true;
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        displayValidationInline={displayValidationInline}
                    />
                );

                expect(
                    rendered
                        .find("StandardControlTemplate")
                        .prop("displayValidationInline")
                ).toEqual(displayValidationInline);
            });
            test("displayValidationInline", () => {
                const onUpdateSection: any = jest.fn();
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        onUpdateSection={onUpdateSection}
                    />
                );

                expect(
                    rendered.find("StandardControlTemplate").prop("onUpdateSection")
                ).toEqual(onUpdateSection);
            });
            test("softRemove", () => {
                const softRemove: boolean = true;
                const rendered: any = mount(
                    <TestFormControlSwitch
                        {...formControlSwitchProps}
                        softRemove={softRemove}
                    />
                );

                expect(
                    rendered.find("StandardControlTemplate").prop("softRemove")
                ).toEqual(softRemove);
            });
        });
    });
});
