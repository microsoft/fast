import { expect } from "chai";
import { attr, AttributeDefinition } from "./attributes.js";
import { FASTElement } from "./fast-element.js";

describe("Attributes", () => {
    it("should be properly aggregated across an inheritance hierarchy.", () => {
        abstract class BaseElement extends FASTElement {
            @attr attributeOne = "";
        }

        class ComponentA extends BaseElement {
            @attr attributeTwo = "two-A";
        }

        class ComponentB extends BaseElement {
            private get attributeTwo(): string {
              return "two-B"
            }
        }

        const componentAAtributes = AttributeDefinition.collect(
            ComponentA
        );

        const componentBAtributes = AttributeDefinition.collect(
            ComponentB
        );

        expect(componentAAtributes.length).equal(2);
        expect(componentBAtributes.length).equal(1);
    });
});
