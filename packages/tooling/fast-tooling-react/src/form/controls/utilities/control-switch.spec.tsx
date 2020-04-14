import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import ControlSwitch, { ControlSwitchProps } from "./control-switch";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { BadgeType, ControlContext } from "../../templates/types";
import {
    arraysSchema as arraySchema,
    checkboxSchema,
    numberFieldSchema,
    objectsSchema as objectSchema,
    textareaSchema,
} from "../../../__tests__/schemas/index";
import {
    ArrayControlConfig,
    CommonControlConfig,
    ControlConfig,
    ControlType,
    LinkedDataControlConfig,
    ListControlConfig,
    NumberFieldTypeControlConfig,
    SectionControlConfig,
    SectionLinkControlConfig,
    SingleLineControlPlugin,
    StandardControlPlugin,
    TextareaControlConfig,
} from "../../templates/index";
import { Controls } from "./types";
import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    DisplayControl,
    LinkedDataControl,
    NumberFieldControl,
    SectionControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
} from "../index";

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
const linkedDataControl: StandardControlPlugin = new StandardControlPlugin({
    context: ControlContext.default,
    control: (config: LinkedDataControlConfig): React.ReactNode => {
        return <LinkedDataControl {...config} />;
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
const sectionControl: StandardControlPlugin = new StandardControlPlugin({
    control: (config: SectionControlConfig): React.ReactNode => {
        return <SectionControl {...config} />;
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
    linkedData: linkedDataControl,
    checkbox: checkboxControl,
    display: displayControl,
    textarea: textareaControl,
    select: selectControl,
    section: sectionControl,
    sectionLink: sectionLinkControl,
    numberField: numberFieldControl,
};

const TestControlSwitch: React.FC<ControlSwitchProps> = (
    props: React.PropsWithChildren<ControlSwitchProps>
): React.ReactElement => {
    return (
        <DndProvider backend={HTML5Backend}>
            <ControlSwitch {...props} />
        </DndProvider>
    );
};

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formControlSwitchProps: ControlSwitchProps = {
    index: 0,
    type: ControlType.section,
    controls,
    propertyName: "",
    label: "Label",
    schema: {},
    data: {},
    schemaDictionary: {},
    required: false,
    untitled: "",
    schemaLocation: "",
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
    navigation: {},
    onUpdateSection: null,
    onChange: null,
    invalidMessage: "",
    validationErrors: [],
    controlComponents: {
        [ControlType.array]: ArrayControl,
        [ControlType.button]: ButtonControl,
        [ControlType.checkbox]: CheckboxControl,
        [ControlType.display]: DisplayControl,
        [ControlType.numberField]: NumberFieldControl,
        [ControlType.sectionLink]: SectionLinkControl,
        [ControlType.select]: SelectControl,
        [ControlType.textarea]: TextareaControl,
    },
    messageSystem: void 0,
};

describe("ControlSwitch", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<TestControlSwitch {...formControlSwitchProps} />);
        }).not.toThrow();
    });
    test("should NOT render any controls when the schema is false", () => {
        const rendered: any = mount(
            <TestControlSwitch {...formControlSwitchProps} schema={false} />
        );

        expect(rendered.html()).toEqual("");
    });
    test("should render a number field when a number type is available", () => {
        const rendered: any = mount(
            <TestControlSwitch
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
            <TestControlSwitch
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
            <TestControlSwitch
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
            <TestControlSwitch
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
            <TestControlSwitch
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
    test("should render a select when enums are available", () => {
        const rendered: any = mount(
            <TestControlSwitch
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
    describe("should pass all config properties to the template", () => {
        describe("common properties", () => {
            test("dataLocation", () => {
                const dataLocation: string = "text";
                const rendered: any = mount(
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch {...formControlSwitchProps} required={true} />
                );

                expect(rendered.find("StandardControlTemplate").prop("required")).toEqual(
                    true
                );
            });
            test("label", () => {
                const label: string = "Foo";
                const rendered: any = mount(
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch {...formControlSwitchProps} onChange={onChange} />
                );

                expect(rendered.find("StandardControlTemplate").prop("onChange")).toEqual(
                    onChange
                );
            });
            test("default", () => {
                const defaultValue: string = "Bar";
                const rendered: any = mount(
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
                    <TestControlSwitch
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
