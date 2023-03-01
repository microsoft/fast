import { expect } from "chai";
import { customElement, FASTElement } from "../components/fast-element.js";
import { Updates } from "../index.js";
import { observable } from "../observation/observable.js";
import { fixture, uniqueElementName } from "../testing/fixture.js";
import type { CSSBindingDirective } from "./css-binding-directive.js";
import { css } from "./css.js";


describe("CSSBindingDirective", () => {
    const name = uniqueElementName();
    const styles = css<TestComponent>`.foo { color: ${x => x.color} }`;
    const cssVar = (styles.behaviors![0] as CSSBindingDirective).targetAspect;

    @customElement({
        name,
        styles
    })
    class TestComponent extends FASTElement {
        @observable public color: string = "red";
    }

    it("sets the model's value to the specified property on the host", async () => {
        const { connect, disconnect, element } = await fixture(name);

        await connect();

        expect(element.style.getPropertyValue(cssVar)).equals("red");

        await disconnect();
    });

    it("updates the specified property on the host when the model value changes", async () => {
        const { connect, disconnect, element } = await fixture<TestComponent>(name);

        await connect();

        element.color = "blue";

        await Updates.next();

        expect(element.style.getPropertyValue(cssVar)).equals("blue");

        await disconnect();
    });
});
