import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { SectionLinkControl } from "./control.section-link";
import { SectionLinkControlProps } from "./control.section-link.props";
import { SectionLinkControlClassNameContract } from "./control.section-link.style";
import { ControlType } from "../templates";
import defaultStrings from "../form.strings";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: SectionLinkControlClassNameContract = {
    sectionLinkControl: "sectionLinkControl-class",
    sectionLinkControl__disabled: "sectionLinkControl__disabled-class",
    sectionLinkControl__default: "sectionLinkControl__default-class",
    sectionLinkControl__invalid: "sectionLinkControl__invalid-class",
};

const sectionLinkProps: SectionLinkControlProps = {
    type: ControlType.sectionLink,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    schemaLocation: "",
    label: "",
    value: {},
    schema: {},
    disabled: false,
    elementRef: null,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    invalidMessage: "",
    validationErrors: [],
    required: false,
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
    categories: {},
};

describe("SectionLinkControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <SectionLinkControl
                    {...sectionLinkProps}
                    managedClasses={managedClasses}
                />
            );
        }).not.toThrow();
    });
    test("should generate an HTML anchor element", () => {
        const rendered: any = mount(
            <SectionLinkControl {...sectionLinkProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("a")).toHaveLength(1);
    });
    test("should fire an `onSectionUpdate` callback with the anchor is clicked", () => {
        const handleSectionUpdate: any = jest.fn();
        const rendered: any = mount(
            <SectionLinkControl
                {...sectionLinkProps}
                managedClasses={managedClasses}
                onUpdateSection={handleSectionUpdate}
            />
        );

        rendered.find("a").at(0).simulate("click");

        expect(handleSectionUpdate).toHaveBeenCalled();
        expect(handleSectionUpdate.mock.calls[0][0]).toEqual("");

        const handleSectionUpdateWithTestLocations: any = jest.fn();
        const renderedWithTestLocations: any = mount(
            <SectionLinkControl
                {...sectionLinkProps}
                managedClasses={managedClasses}
                onUpdateSection={handleSectionUpdateWithTestLocations}
                schemaLocation={"properties.test"}
                dataLocation={"test"}
            />
        );

        renderedWithTestLocations.find("a").at(0).simulate("click");

        expect(handleSectionUpdateWithTestLocations).toHaveBeenCalled();
        expect(handleSectionUpdateWithTestLocations.mock.calls[0][0]).toEqual("");
    });
    test("should add a disabled class if the disabled prop is passed", () => {
        const rendered: any = mount(
            <SectionLinkControl
                {...sectionLinkProps}
                managedClasses={managedClasses}
                disabled={true}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionLinkControl__disabled}`)
        ).toHaveLength(1);
    });
    test("should have the default class when default prop is passed", () => {
        const rendered: any = mount(
            <SectionLinkControl
                {...sectionLinkProps}
                value={undefined}
                default={{}}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionLinkControl__default}`)
        ).toHaveLength(1);
    });
    test("should add an invalid class if the invalid prop is passed and is not an empty string", () => {
        const rendered: any = mount(
            <SectionLinkControl
                {...sectionLinkProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionLinkControl__invalid}`)
        ).toHaveLength(1);
    });
});
