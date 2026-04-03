import "./install-dom-shim.js";
import { strictEqual } from "node:assert/strict";
import { describe, test } from "node:test";
import { FallbackRenderer } from "./element-renderer/element-renderer.js";
import { AttributesMap } from "./element-renderer/interfaces.js";
import { DefaultRenderInfo } from "./render-info.js"

describe("RenderInfo", () => {
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

    describe("should have a 'dispose' method", () => {
        test("that calls the disconnectedCallback for all renderers in 'customElementInstanceStack'", () => {
            const renderInfo = new DefaultRenderInfo([TestRenderer]);
            const renderers = [new TestRenderer("test"), new TestRenderer("test"), new TestRenderer("test")]
            renderInfo.customElementInstanceStack.push(...renderers);

            renderers.forEach(x => {x.connectedCallback(); strictEqual(x.connected, true)})

            renderInfo.dispose();

            renderers.forEach(x => strictEqual(x.connected, false))
        });
        test("that calls the disconnectedCallback for all renderers in 'renderCustomElementList'", () => {
            const renderInfo = new DefaultRenderInfo([TestRenderer]);
            const renderers = [new TestRenderer("test"), new TestRenderer("test"), new TestRenderer("test")]
            renderInfo.renderedCustomElementList.push(...renderers);

            renderers.forEach(x => {x.connectedCallback(); strictEqual(x.connected, true)})

            renderInfo.dispose();

            renderers.forEach(x => strictEqual(x.connected, false))
        });

        test("that removes all renderers from 'renderCustomElementList' and 'customElementInstanceStack", () => {
            const renderInfo = new DefaultRenderInfo([TestRenderer]);
            const rendered = [new TestRenderer("test"), new TestRenderer("test"), new TestRenderer("test")];
            const instances = [new TestRenderer("test"), new TestRenderer("test"), new TestRenderer("test")];
            renderInfo.renderedCustomElementList.push(...rendered);
            renderInfo.customElementInstanceStack.push(...instances);

            strictEqual(renderInfo.renderedCustomElementList.length, 3);
            strictEqual(renderInfo.customElementInstanceStack.length, 3);
            renderInfo.dispose();

            strictEqual(renderInfo.renderedCustomElementList.length, 0);
            strictEqual(renderInfo.customElementInstanceStack.length, 0);
        });

    })
});
