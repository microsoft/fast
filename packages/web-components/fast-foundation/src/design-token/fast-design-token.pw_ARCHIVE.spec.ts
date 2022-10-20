/* eslint-disable @typescript-eslint/no-empty-function */
// import { jest } from "@jest/globals";
// import { css, FASTElement, html, Observable, Updates } from "@microsoft/fast-element";
import { uniqueElementName } from "@microsoft/fast-element/testing";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import type { DesignTokenResolver } from "./core/design-token-node.js";
import type { PropertyTarget } from "./custom-property-manager.js";
// import { CSSDesignToken, DesignToken } from "./fast-design-token.js";
import type { DesignTokenSubscriber } from "./fast-design-token.js";

// console.log(jest);

// chai.use(spies);


test.describe("A DesignToken", () => {
    let page: Page;
    const elementName = uniqueElementName();

    function uniqueTokenName() {
        return uniqueElementName() + "token";
    }

    function createElement() /* : FASTElement & HTMLElement*/ {
        // return document.createElement(`fast-${elementName}`) as any;
    }
    function addElement(parent = document.body) /*: FASTElement & HTMLElement */ {
        // const el = createElement();
        // parent.appendChild(el);
        // return el;
    }

    function removeElement(...els: HTMLElement[]) {
        els.forEach(el => {
            el.parentElement?.removeChild(el);
        })
    }
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        // await page.evaluate(() => {
        //     class MyElement extends FASTElement {}
        //     MyElement.define({name: `fast-${elementName}`, template: html`<slot></slot>`})
        // })
    })

    test.afterAll(() => page.close())
    // test.beforeEach(async () => {
    //     await page.evaluate(() => {
    //         DesignToken.registerDefaultStyleTarget();
    //     })
    //     await Updates.next();
    // });

    test.afterEach(async () => {
        await page.evaluate(() => {
            DesignToken.unregisterDefaultStyleTarget();
        })
        await Updates.next();
    });




});
