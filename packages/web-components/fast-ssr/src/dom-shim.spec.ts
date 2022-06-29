import "./install-dom-shim.js";
import { expect, test } from "@playwright/test";
import  { createWindow } from "./dom-shim.js";
import * as Foundation from "@microsoft/fast-foundation";
import { ElementViewTemplate, FASTElement } from "@microsoft/fast-element";
import fastSSR from "./exports.js";

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
    [Foundation.FASTMenuItem, Foundation.menuItemTemplate({
        anchoredRegion
    })],
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
    [Foundation.FASTTooltip, Foundation.tooltipTemplate({
        anchoredRegion
    })],
    [Foundation.FASTTreeItem, Foundation.treeItemTemplate()],
    [Foundation.FASTTreeView, Foundation.treeViewTemplate()]
];

test.describe("The foundation DOM shim", () => {
    componentsAndTemplates.forEach(([ctor, template]) => {
        const name = deriveName(ctor);
        ctor.define({ name, template });

        test(`should support construction and connection of the ${ctor.name} component and template during SSR rendering`, () => {
            const { templateRenderer, defaultRenderInfo } = fastSSR();
            const templateString = `<${name}></${name}>`;
            expect(() => templateRenderer.render(templateString, defaultRenderInfo)).not.toThrow();
        });
    });
})
