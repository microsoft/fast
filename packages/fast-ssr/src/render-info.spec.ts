import "./install-dom-shim.js";
import { expect, test } from "@playwright/test";
import { FallbackRenderer } from "./element-renderer/element-renderer.js";
import { AttributesMap } from "./element-renderer/interfaces.js";
import { DefaultRenderInfo } from "./render-info.js"

test.describe("RenderInfo", () => {
    class TestRenderer extends FallbackRenderer {
        static matchesClass(ctor: { new(): HTMLElement; prototype: HTMLElement; }, tagName: string, attributes: AttributesMap): boolean {
            return true;
        }
        public connected = false;

        connectedCallback() {
            super.connectedCallback();
            this.connected = true;
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.connected = false;
        }
    }

    test.describe("should have a 'dispose' method", () => {
        test("that calls the disconnectedCallback for all renderers in 'customElementInstanceStack'", () => {
            const renderInfo = new DefaultRenderInfo([TestRenderer]);
            const renderers = [new TestRenderer("test"), new TestRenderer("test"), new TestRenderer("test")]
            renderInfo.customElementInstanceStack.push(...renderers);

            renderers.forEach(x => {x.connectedCallback(); expect(x.connected).toBe(true)})

            renderInfo.dispose();

            renderers.forEach(x => expect(x.connected).toBe(false))
        });
        test("that calls the disconnectedCallback for all renderers in 'renderCustomElementList'", () => {
            const renderInfo = new DefaultRenderInfo([TestRenderer]);
            const renderers = [new TestRenderer("test"), new TestRenderer("test"), new TestRenderer("test")]
            renderInfo.renderedCustomElementList.push(...renderers);

            renderers.forEach(x => {x.connectedCallback(); expect(x.connected).toBe(true)})

            renderInfo.dispose();

            renderers.forEach(x => expect(x.connected).toBe(false))
        });

        test("that removes all renderers from 'renderCustomElementList' and 'customElementInstanceStack", () => {
            const renderInfo = new DefaultRenderInfo([TestRenderer]);
            const rendered = [new TestRenderer("test"), new TestRenderer("test"), new TestRenderer("test")];
            const instances = [new TestRenderer("test"), new TestRenderer("test"), new TestRenderer("test")];
            renderInfo.renderedCustomElementList.push(...rendered);
            renderInfo.customElementInstanceStack.push(...instances);

            expect(renderInfo.renderedCustomElementList.length).toBe(3);
            expect(renderInfo.customElementInstanceStack.length).toBe(3);
            renderInfo.dispose();

            expect(renderInfo.renderedCustomElementList.length).toBe(0);
            expect(renderInfo.customElementInstanceStack.length).toBe(0);
        });

    })
});
