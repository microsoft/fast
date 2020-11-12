import { css, FASTElement, FASTElementDefinition, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { FASTProvider, Provider } from "../provider";
import { FASTConfiguration } from "./index";

describe("FASTConfiguration", () => {
    it("Should initialize with a default prefix of 'fast'", () => {
        expect(new FASTConfiguration().prefix).to.equal("fast");
    });

    it("Should initialize with a provided prefix", () => {
        expect(new FASTConfiguration({ prefix: "custom" }).prefix).to.equal("custom");
    });

    it("should allow registry and retrieval of a default template by element name", () => {
        const conf = new FASTConfiguration();
        const template = html``;

        conf.setDefaultTemplateFor("my-element", template);

        expect(conf.getDefaultTemplateFor("my-element")).to.equal(template);
    });

    it("should allow registry and retrieval of a default style by element name", () => {
        const conf = new FASTConfiguration();
        const styles = css``;

        conf.setDefaultStylesFor("my-element", styles);

        expect(conf.getDefaultStylesFor("my-element")).to.equal(styles);
    });

    it("should allow registration of custom elements with registerElement()", () => {
        class MyEl extends FASTElement {}

        new FASTConfiguration().registerElement(MyEl, { name: "my-element" });

        expect(customElements.get("my-element")).to.equal(MyEl);
    });

    describe(".forComponent", () => {
        it("should register an element, default template, and default styles for a Configuration", () => {
            const conf = new FASTConfiguration();
            const styles = css``;
            const template = html``;
            const baseName = "element";
            class MyElement extends FASTElement {}

            const myElement = FASTConfiguration.forComponent({
                styles,
                template,
                baseName,
                type: MyElement,
            });

            conf.register(myElement());

            expect(conf.getDefaultStylesFor("fast-element")).to.equal(styles);
            expect(conf.getDefaultTemplateFor("fast-element")).to.equal(template);
            expect(customElements.get(`${conf.prefix}-${baseName}`)).to.equal(MyElement);
        });

        it("should provider opportunity to override template, styles, prefix, and baseName of a registry for a configuration", () => {
            const conf = new FASTConfiguration();
            class MyElement extends FASTElement {}

            const myElement = FASTConfiguration.forComponent({
                styles: css``,
                template: html``,
                baseName: "foo",
                type: MyElement,
            });

            const overrides = {
                prefix: "my",
                baseName: "custom-element",
                styles: css``,
                template: html``,
            };

            conf.register(myElement(overrides));

            expect(conf.getDefaultStylesFor("fast-foo")).to.equal(null);
            expect(conf.getDefaultTemplateFor("fast-foo")).to.equal(null);
            expect(customElements.get(`fast-foo`)).to.equal(undefined);

            const elName = `${overrides.prefix}-${overrides.baseName}`;
            expect(conf.getDefaultStylesFor(elName)).to.equal(overrides.styles);
            expect(conf.getDefaultTemplateFor(elName)).to.equal(overrides.template);
            expect(customElements.get(elName)).to.equal(MyElement);
        });
    });

    describe(".defineProvider", () => {
        it("should return a FASTProvider custom element constructor with the default tag name 'fast-provider'", done => {
            const conf = new FASTConfiguration();
            const P = conf.defineProvider();

            const element = (document.createElement(
                "fast-provider"
            ) as unknown) as Provider;
            document.body.appendChild((element as unknown) as HTMLElement); // TODO: why do I need to cast?

            window.setTimeout(() => {
                expect(element instanceof FASTProvider).to.equal(true);
                expect(element instanceof P).to.equal(true); // TODO: why is this not passing?
                expect(element.configuration).to.equal(conf); // TODO: why is this not passing?

                done();
            });
        });
    });
});
