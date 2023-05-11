import { expect } from "chai";
import { attr } from "../components/attributes.js";
import { customElement, FASTElement } from "../components/fast-element.js";
import { observable } from "../observation/observable.js";
import { Updates } from "../observation/update-queue.js";
import { fixture, uniqueElementName } from "../testing/fixture.js";
import type { CSSBindingDirective } from "./css-binding-directive.js";
import { css } from "./css.js";

describe("CSSBindingDirective", () => {
    const name = uniqueElementName();
    const styles = css<TestComponent>`.foo { color: ${x => x.color} } .bar { height: ${x => x.size} }`;
    const cssVar1 = (styles.behaviors![0] as CSSBindingDirective).targetAspect;
    const cssVar2 = (styles.behaviors![1] as CSSBindingDirective).targetAspect;

    @customElement({
        name,
        styles
    })
    class TestComponent extends FASTElement {
        @observable public color: string = "red";
        @attr public size = "300px";
    }

    it("sets the model's value to the specified property on the host", async () => {
        const { connect, disconnect, element } = await fixture(name);

        await connect();

        expect(element.style.getPropertyValue(cssVar1)).equals("red");
        expect(element.style.getPropertyValue(cssVar2)).equals("300px");

        await disconnect();
    });

    it("updates the specified property on the host when the model value changes", async () => {
        const { connect, disconnect, element } = await fixture<TestComponent>(name);

        await connect();

        element.color = "blue";

        await Updates.next();

        expect(element.style.getPropertyValue(cssVar1)).equals("blue");
        expect(element.style.getPropertyValue(cssVar2)).equals("300px");

        element.size = "400px";

        await Updates.next();

        expect(element.style.getPropertyValue(cssVar1)).equals("blue");
        expect(element.style.getPropertyValue(cssVar2)).equals("400px");

        element.color = "red";
        element.size = "300px";

        await Updates.next();

        expect(element.style.getPropertyValue(cssVar1)).equals("red");
        expect(element.style.getPropertyValue(cssVar2)).equals("300px");

        await disconnect();
    });

    it("updates the specified property on the host when the styles change via setAttribute", async () => {
        const { connect, disconnect, element } = await fixture<TestComponent>(name);

        await connect();

        element.color = "blue";
        element.size = "400px";

        await Updates.next();

        expect(element.style.getPropertyValue(cssVar1)).equals("blue");
        expect(element.style.getPropertyValue(cssVar2)).equals("400px");

        element.setAttribute("style", "background: red");

        expect(element.style.getPropertyValue(cssVar1)).equals("blue");
        expect(element.style.getPropertyValue(cssVar2)).equals("400px");
        expect(element.style.getPropertyValue("background")).equals("red");

        await disconnect();
    });
});
