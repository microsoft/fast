import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Mapping from "./form-item.mapping";
import { FormItemComponentMappingToProperyNamesProps, mappingName } from "./form-item";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const mappingProps: FormItemComponentMappingToProperyNamesProps = {
    index: 1,
    dataLocation: "",
    data: {},
    required: false,
    label: "",
    onChange: jest.fn(),
    name: mappingName.textAlign,
    options: [],
};

describe("Mapping", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Mapping {...mappingProps} />);
        }).not.toThrow();
    });
});
