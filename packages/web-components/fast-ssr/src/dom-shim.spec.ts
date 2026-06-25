import "./install-dom-shim.js";

import { ElementViewTemplate, FASTElement } from "@microsoft/fast-element";
import * as Foundation from "@microsoft/fast-foundation";
import { expect, test } from "@playwright/test";
import { createWindow } from "./dom-shim.js";
import fastSSR from "./exports.js";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";

test.describe("createWindow", () => {
    test("should create a window with a document property that is an instance of the window's Document constructor", () => {
        const window = createWindow();

        expect(window.document instanceof (window.Document as any)).toBe(true);

        class MyDocument {}
        const windowOverride = createWindow({ Document: MyDocument });
        expect(windowOverride.document instanceof MyDocument).toBe(true);
    });
    test("should create a window with a customElements property that is an instance of the window's CustomElementRegistry constructor", () => {
        const window = createWindow();

        expect(window.customElements instanceof (window.CustomElementRegistry as any)).toBe(true);

        class MyRegistry {}
        const windowOverride = createWindow({ CustomElementRegistry: MyRegistry });
        expect(windowOverride.customElements instanceof MyRegistry).toBe(true);
    });
})

function deriveName(ctor: typeof FASTElement) {
    const baseName = ctor.name.toLowerCase();
    return `fast-${baseName}`;
}

const dataGrid = deriveName(Foundation.FASTDataGrid);
const dataGridRow = deriveName(Foundation.FASTDataGridRow);
const dataGridCell = deriveName(Foundation.FASTDataGridCell);
const anchoredRegion = deriveName(Foundation.FASTAnchoredRegion);
const pickerList = deriveName(Foundation.FASTPickerList);
const pickerListItem = deriveName(Foundation.FASTPickerListItem);
const pickerMenu = deriveName(Foundation.FASTPickerMenu);
const pickerMenuOption = deriveName(Foundation.FASTPickerMenuOption);
const progressRing = deriveName(Foundation.FASTProgressRing);

const componentsAndTemplates: [typeof FASTElement, ElementViewTemplate][] = [
    [Foundation.FASTAccordion, Foundation.accordionTemplate()],
    [Foundation.FASTAccordionItem, Foundation.accordionItemTemplate()],
    [Foundation.FASTAnchor, Foundation.anchorTemplate()],
    [Foundation.FASTAnchoredRegion, Foundation.anchoredRegionTemplate()],
    [Foundation.FASTAvatar, Foundation.avatarTemplate()],
    [Foundation.FASTBadge, Foundation.badgeTemplate()],
    [Foundation.FASTBreadcrumb, Foundation.breadcrumbTemplate()],
    [Foundation.FASTBreadcrumbItem, Foundation.breadcrumbItemTemplate()],
    [Foundation.FASTButton, Foundation.buttonTemplate()],
    [Foundation.FASTCalendar, Foundation.calendarTemplate({
        dataGrid,
        dataGridRow,
        dataGridCell
    })],
    [Foundation.FASTCard, Foundation.cardTemplate()],
    [Foundation.FASTCheckbox, Foundation.checkboxTemplate()],
    [Foundation.FASTCombobox, Foundation.comboboxTemplate()],
    [Foundation.FASTDataGrid, Foundation.dataGridTemplate({
        dataGridRow
    })],
    [Foundation.FASTDataGridCell, Foundation.dataGridCellTemplate()],
    [Foundation.FASTDataGridRow, Foundation.dataGridRowTemplate({
        dataGridCell
    })],
    [Foundation.FASTDialog, Foundation.dialogTemplate()],
    [Foundation.FASTDisclosure, Foundation.disclosureTemplate()],
    [Foundation.FASTDivider, Foundation.dividerTemplate()],
    [Foundation.FASTFlipper, Foundation.flipperTemplate()],
    [Foundation.FASTHorizontalScroll, Foundation.horizontalScrollTemplate()],
    [Foundation.FASTListbox as any as typeof FASTElement, Foundation.listboxTemplate()],
    [Foundation.FASTListboxOption, Foundation.listboxOptionTemplate()],
    [Foundation.FASTMenu, Foundation.menuTemplate()],
    [Foundation.FASTMenuItem, Foundation.menuItemTemplate()],
    [Foundation.FASTNumberField, Foundation.numberFieldTemplate()],
    [Foundation.FASTPicker, Foundation.pickerTemplate({
        anchoredRegion,
        pickerList,
        pickerListItem,
        pickerMenu,
        pickerMenuOption,
        progressRing
    })],
    [Foundation.FASTPickerList, Foundation.pickerListTemplate()],
    [Foundation.FASTPickerListItem, Foundation.pickerListItemTemplate()],
    [Foundation.FASTPickerMenu, Foundation.pickerMenuTemplate()],
    [Foundation.FASTPickerMenuOption, Foundation.pickerMenuOptionTemplate()],
    [Foundation.FASTProgress, Foundation.progressTemplate()],
    [Foundation.FASTProgressRing, Foundation.progressRingTemplate()],
    [Foundation.FASTRadio, Foundation.radioTemplate()],
    [Foundation.FASTRadioGroup, Foundation.radioGroupTemplate()],
    [Foundation.FASTSearch, Foundation.searchTemplate()],
    [Foundation.FASTSkeleton, Foundation.skeletonTemplate()],
    [Foundation.FASTSlider, Foundation.sliderTemplate()],
    [Foundation.FASTSliderLabel, Foundation.sliderLabelTemplate()],
    [Foundation.FASTSwitch, Foundation.switchTemplate()],
    [Foundation.FASTTab, Foundation.tabTemplate()],
    [Foundation.FASTTabPanel, Foundation.tabPanelTemplate()],
    [Foundation.FASTTabs, Foundation.tabsTemplate()],
    [Foundation.FASTTextArea, Foundation.textAreaTemplate()],
    [Foundation.FASTTextField, Foundation.textFieldTemplate()],
    [Foundation.FASTToolbar, Foundation.toolbarTemplate()],
    [Foundation.FASTTooltip, Foundation.tooltipTemplate()],
    [Foundation.FASTTreeItem, Foundation.treeItemTemplate()],
    [Foundation.FASTTreeView, Foundation.treeViewTemplate()]
];

test.describe("The DOM shim", () => {
    componentsAndTemplates.forEach(([ctor, template]) => {
        const name = deriveName(ctor);
        ctor.define({ name, template });

        test(`should support construction and connection of the ${ctor.name} component and template during SSR rendering`, () => {
            const { templateRenderer } = fastSSR();
            const templateString = `<${name}></${name}>`;
            expect(() => templateRenderer.render(templateString)).not.toThrow();
        });
    });

    test.describe("has a CSSStyleSheet implementation", () => {
        test("that is constructable", () => {
            expect(() => new CSSStyleSheet()).not.toThrow();
        });
        test("that supports adding :host{} and :root{} rules", () => {
            const sheet = new CSSStyleSheet();
            const hostIndex = sheet.insertRule(":host{}");
            expect(sheet.cssRules[hostIndex].cssText).toBe(":host {  }");
            const rootIndex = sheet.insertRule(":root{}");
            expect(sheet.cssRules[rootIndex].cssText).toBe(":root {  }");
        });

        test.describe("with rule implementations", () => {
            test("that support setting properties from the style declaration", () => {
                const sheet = new CSSStyleSheet();
                const index = sheet.insertRule(":host{}");
                const rule = sheet.cssRules[index] as CSSStyleRule;
                rule.style.setProperty("--test", "value");

                expect(rule.cssText).toBe(":host { --test: value; }");
            });
            test("that support removing properties from the style declaration", () => {
                const sheet = new CSSStyleSheet();
                const index = sheet.insertRule(":host{}");
                const rule = sheet.cssRules[index] as CSSStyleRule;
                rule.style.setProperty("--test", "value");
                rule.style.removeProperty("--test");

                expect(rule.cssText).toBe(":host {  }");
            })
        })
    });

    test.describe("has a matchMedia method", () => {
        test("that can returns the MediaQueryList supplied to createWindow", () => {
            class MyMediaQueryList {};

            const win: any = createWindow({MediaQueryList: MyMediaQueryList});
            const list = win.matchMedia();

            expect(list).toBeInstanceOf(MyMediaQueryList);
        })
    });

    test.describe("DOMTokenList", () => {
        class TestElement extends FASTElement {}
        TestElement.define({ name: uniqueElementName() })

        test("adds a token", () => {
            const element = new TestElement();
            const cList = element.classList;

            cList.toggle("c1");
            expect(cList.contains("c1"), "adds a token that is not present").toBeTruthy();

            expect(
                cList.toggle("c2"),
                "returns true when token is added"
            ).toStrictEqual(true);
        });

        test("removes a token", () => {
            const element = new TestElement();
            const cList = element.classList;

            cList.add("c1");
            cList.toggle("c1");

            expect(!cList.contains("c1"), "removes a token that is present").toBeTruthy();

            cList.add("c2");
            expect(
                cList.toggle("c2"),
                "return false when token is removed"
            ).toStrictEqual(false);
        });

        test("adds token with second argument", () => {
            const element = new TestElement();
            const cList = element.classList;

            cList.toggle("c1", true);
            expect(cList.contains("c1"), "adds a token").toBeTruthy();

            expect(
                cList.toggle("c2", true),
                "returns true when token is added"
            ).toStrictEqual(true);

            cList.add("c3");
            cList.toggle("c3", true);

            expect(
                cList.contains("c3"),
                "does not remove a token that is already present"
            ).toBeTruthy();

            cList.add("c4");

            expect(
                cList.toggle("c4", true),
                "returns true when token is already present"
            ).toStrictEqual(true);
        });

        test("removes token with second argument", () => {
            const element = new TestElement();
            const cList = element.classList;

            cList.add("c1");
            cList.toggle("c1", false);

            expect(!cList.contains("c1"), "removes a token").toBeTruthy();

            expect(
                cList.toggle("c2", false),
                "returns false when token is removed"
            ).toStrictEqual(false);

            cList.toggle("c3", false);

            expect(
                !cList.contains("c3"),
                "does not add a token that is not present"
            ).toBeTruthy();

            expect(
                cList.toggle("c4", false),
                "returns false when token was not present"
            ).toStrictEqual(false);
        });

        test("removes duplicated tokens", () => {
            const element = new TestElement();
            element.className = "ho ho ho";

            const cList = element.classList;
            cList.remove("ho");
            expect(!cList.contains("ho"), "should remove all instances of 'ho'").toBeTruthy();
            expect(element.className).toStrictEqual("");
        });
    });
})
