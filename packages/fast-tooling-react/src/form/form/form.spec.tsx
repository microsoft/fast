import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Form from "./form";
import { FormProps } from "./form.props";

import objectSchema from "../../__tests__/schemas/objects.schema.json";
import arraySchema from "../../__tests__/schemas/arrays.schema.json";
import childrenSchema from "../../__tests__/schemas/children.schema.json";
import pluginSchema from "../../__tests__/schemas/plugin.schema.json";

import { StringUpdateSchemaPlugin } from "../../../app/pages/form/plugin/plugin";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formProps: FormProps = {
    childOptions: [],
    schema: {},
    data: "",
    onChange: jest.fn(),
};

describe("Form", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Form {...formProps} />);
        }).not.toThrow();
    });
    test("should update the location by clicking a section link if location is not controlled by the user", () => {
        const rendered: any = mount(
            <Form
                {...formProps}
                schema={objectSchema}
                data={{
                    objectNoRequired: {},
                }}
            />
        );
        const form: any = rendered.find("Form");

        expect(form.state("navigation")).toHaveLength(1);

        form.find("FormItemSectionLink")
            .at(0)
            .find("a")
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(2);
    });
    test("should not update the location by clicking a section link if location is not controlled by the user", () => {
        const locationCallback: any = jest.fn();
        const rendered: any = mount(
            <Form
                {...formProps}
                schema={objectSchema}
                data={{
                    objectNoRequired: {},
                }}
                location={{
                    dataLocation: "",
                    onChange: locationCallback,
                }}
            />
        );
        const form: any = rendered.find("Form");

        expect(form.state("navigation")).toHaveLength(1);

        form.find("FormItemSectionLink")
            .at(0)
            .find("a")
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(1);
        expect(locationCallback).toHaveBeenCalled();
        expect(locationCallback.mock.calls[0][0]).toEqual("objectNoRequired");
    });
    test("should update the location by clicking an array link if location is not controlled by the user", () => {
        const rendered: any = mount(
            <Form
                {...formProps}
                schema={arraySchema}
                data={{
                    strings: ["Foo", "Bar"],
                }}
            />
        );
        const form: any = rendered.find("Form");

        expect(form.state("navigation")).toHaveLength(1);

        form.find("FormItemArray")
            .at(0)
            .find("a")
            .at(0)
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(2);
    });
    test("should not update the location by clicking an array link if location is not controlled by the user", () => {
        const locationCallback: any = jest.fn();
        const rendered: any = mount(
            <Form
                {...formProps}
                schema={arraySchema}
                data={{
                    strings: ["Foo", "Bar"],
                }}
                location={{
                    dataLocation: "",
                    onChange: locationCallback,
                }}
            />
        );
        const form: any = rendered.find("Form");

        expect(form.state("navigation")).toHaveLength(1);

        form.find("FormItemArray")
            .at(0)
            .find("a")
            .at(0)
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(1);
        expect(locationCallback).toHaveBeenCalled();
        expect(locationCallback.mock.calls[0][0]).toEqual("strings[0]");
    });
    test("should update the location by clicking a children link if location is not controlled by the user", () => {
        const rendered: any = mount(
            <Form
                {...formProps}
                schema={childrenSchema}
                data={{
                    children: "Foo",
                }}
            />
        );
        const form: any = rendered.find("Form");

        expect(form.state("navigation")).toHaveLength(1);

        form.find("FormItemChildren")
            .at(0)
            .find("a")
            .at(0)
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(2);
    });
    test("should not update the location by clicking a children link if location is not controlled by the user", () => {
        const locationCallback: any = jest.fn();
        const rendered: any = mount(
            <Form
                {...formProps}
                schema={childrenSchema}
                data={{
                    children: "Foo",
                }}
                location={{
                    dataLocation: "",
                    onChange: locationCallback,
                }}
            />
        );
        const form: any = rendered.find("Form");

        expect(form.state("navigation")).toHaveLength(1);

        form.find("FormItemChildren")
            .at(0)
            .find("a")
            .at(0)
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(1);
        expect(locationCallback).toHaveBeenCalled();
        expect(locationCallback.mock.calls[0][0]).toEqual("children");
    });
    test("should update the location by clicking a breadcrumb link if location is not controlled by the user", () => {
        const rendered: any = mount(
            <Form
                {...formProps}
                schema={objectSchema}
                data={{
                    objectNoRequired: {},
                }}
            />
        );
        const form: any = rendered.find("Form");

        expect(form.state("navigation")).toHaveLength(1);

        form.find("FormItemSectionLink")
            .at(0)
            .find("a")
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(2);

        rendered
            .find("Form")
            .find("a")
            .at(0)
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(1);
    });
    test("should not update the location by clicking a breadcrumb link if location is not controlled by the user", () => {
        const locationCallback: any = jest.fn();
        const rendered: any = mount(
            <Form
                {...formProps}
                schema={objectSchema}
                data={{
                    objectNoRequired: {},
                }}
                location={{
                    dataLocation: "objectNoRequired",
                    onChange: locationCallback,
                }}
            />
        );
        const form: any = rendered.find("Form");

        expect(form.state("navigation")).toHaveLength(2);

        rendered
            .find("Form")
            .find("a")
            .simulate("click");

        expect(form.state("navigation")).toHaveLength(2);
        expect(locationCallback).toHaveBeenCalled();
        expect(locationCallback.mock.calls[0][0]).toEqual("");
    });
    test("should not trigger the `onSchemaChange` if the schema does not have plugins", () => {
        const callback: any = jest.fn();
        const plugins: any = [
            new StringUpdateSchemaPlugin({
                id: "plugins/pluginModifiedString",
            }),
        ];
        const rendered: any = mount(
            <Form
                schema={objectSchema}
                data={{}}
                onChange={jest.fn()}
                plugins={plugins}
                onSchemaChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);
    });
    test("should trigger the `onSchemaChange`if the schema has plugins", () => {
        const callback: any = jest.fn();
        const plugins: any = [
            new StringUpdateSchemaPlugin({
                id: "plugins/pluginModifiedString",
            }),
        ];
        const rendered: any = mount(
            <Form
                schema={pluginSchema}
                data={{}}
                onChange={jest.fn()}
                plugins={plugins}
                onSchemaChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(1);
    });
    test("should not trigger the `onSchemaChange` if the schema has been changed and the schema does not have plugins", () => {
        const callback: any = jest.fn();
        const plugins: any = [
            new StringUpdateSchemaPlugin({
                id: "plugins/pluginModifiedString",
            }),
        ];
        const rendered: any = mount(
            <Form
                schema={pluginSchema}
                data={{}}
                onChange={jest.fn()}
                plugins={plugins}
                onSchemaChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(1);

        rendered.setProps({ schema: objectSchema });

        expect(callback).toHaveBeenCalledTimes(1);
    });
    test("should trigger the `onSchemaChange` if the schema has been changed and the schema has plugins", () => {
        const callback: any = jest.fn();
        const plugins: any = [
            new StringUpdateSchemaPlugin({
                id: "plugins/pluginModifiedString",
            }),
        ];
        const rendered: any = mount(
            <Form
                schema={objectSchema}
                data={{}}
                onChange={jest.fn()}
                plugins={plugins}
                onSchemaChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered.setProps({ schema: pluginSchema });

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
