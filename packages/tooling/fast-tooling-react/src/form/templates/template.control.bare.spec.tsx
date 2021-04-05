import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { BareControlTemplate } from "./template.control.bare";
import { BareControlTemplateProps } from "./template.control.bare.props";
import { BareControlTemplateClassNameContract } from "./template.control.bare.style";
import { ControlType } from "../index";
import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    DisplayControl,
    NumberFieldControl,
    SectionControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
} from "../controls";
import defaultStrings from "../form.strings";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: BareControlTemplateClassNameContract = {
    bareControlTemplate: "bareControlTemplate",
    bareControlTemplate__disabled: "bareControlTemplate__disabled",
};

const props: BareControlTemplateProps = {
    index: 1,
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
    navigation: {},
    schemaLocation: "",
    control: jest.fn(),
    data: void 0,
    schemaDictionary: {},
    schema: {},
    required: void 0,
    label: "foo",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    invalidMessage: "",
    validationErrors: [],
    component: null,
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
    controls: {
        [ControlType.array]: null,
        [ControlType.linkedData]: null,
        [ControlType.button]: null,
        [ControlType.checkbox]: null,
        [ControlType.display]: null,
        [ControlType.numberField]: null,
        [ControlType.sectionLink]: null,
        [ControlType.section]: null,
        [ControlType.select]: null,
        [ControlType.textarea]: null,
    },
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
    categories: {},
};

describe("BareControlTemplate", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<BareControlTemplate {...props} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should have the disabled class when disabled prop is passed", () => {
        const rendered: any = mount(
            <BareControlTemplate
                {...props}
                data={"foo"}
                disabled={true}
                managedClasses={managedClasses}
            />
        );
        const wrapper: any = rendered.find(
            `.${managedClasses.bareControlTemplate__disabled}`
        );

        expect(wrapper).toHaveLength(1);
    });
});
