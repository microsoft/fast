import "./uninstall-dom-shim.js";
import "./install-foundation-dom-shim.js";
import { ViewTemplate } from "@microsoft/fast-element";
import * as Foundation  from "@microsoft/fast-foundation";
import { expect, test } from "@playwright/test";
import fastSSR from "./exports.js";

const designSystem = Foundation.DesignSystem.getOrCreate();

const componentsAndTemplates: [typeof Foundation.FoundationElement, ViewTemplate | Foundation.FoundationElementTemplate<any>][] = [
    [Foundation.Accordion, Foundation.accordionTemplate],
    [Foundation.AccordionItem, Foundation.accordionItemTemplate],
    [Foundation.Anchor, Foundation.anchorTemplate],
    [Foundation.AnchoredRegion, Foundation.anchoredRegionTemplate],
    [Foundation.Avatar, Foundation.avatarTemplate],
    [Foundation.Badge, Foundation.badgeTemplate],
    [Foundation.Breadcrumb, Foundation.breadcrumbTemplate],
    [Foundation.BreadcrumbItem, Foundation.breadcrumbItemTemplate],
    [Foundation.Button, Foundation.buttonTemplate],
    [Foundation.Calendar, Foundation.calendarTemplate],
    [Foundation.Card, Foundation.cardTemplate],
    [Foundation.Checkbox, Foundation.checkboxTemplate],
    [Foundation.Combobox, Foundation.comboboxTemplate],
    [Foundation.DataGrid, Foundation.dataGridTemplate],
    [Foundation.DataGridCell, Foundation.dataGridCellTemplate],
    [Foundation.DataGridRow, Foundation.dataGridRowTemplate],
    [Foundation.Dialog, Foundation.dialogTemplate],
    [Foundation.Disclosure, Foundation.disclosureTemplate],
    [Foundation.Divider, Foundation.dividerTemplate],
    [Foundation.Flipper, Foundation.flipperTemplate],
    [Foundation.HorizontalScroll, Foundation.horizontalScrollTemplate],
    [Foundation.Listbox as unknown as typeof Foundation.FoundationElement, Foundation.listboxTemplate],
    [Foundation.ListboxOption, Foundation.listboxOptionTemplate],
    [Foundation.Menu, Foundation.menuTemplate],
    [Foundation.MenuItem, Foundation.menuItemTemplate],
    [Foundation.NumberField, Foundation.numberFieldTemplate],
    [Foundation.Picker, Foundation.pickerTemplate],
    [Foundation.PickerList, Foundation.pickerListTemplate],
    [Foundation.PickerListItem, Foundation.pickerListItemTemplate],
    [Foundation.PickerMenu, Foundation.pickerMenuTemplate],
    [Foundation.PickerMenuOption, Foundation.pickerMenuOptionTemplate],
    [Foundation.BaseProgress, Foundation.progressTemplate],
    [Foundation.Radio, Foundation.radioTemplate],
    [Foundation.RadioGroup, Foundation.radioGroupTemplate],
    [Foundation.Search, Foundation.searchTemplate],
    [Foundation.Skeleton, Foundation.skeletonTemplate],
    [Foundation.Slider, Foundation.sliderTemplate],
    [Foundation.SliderLabel, Foundation.sliderLabelTemplate],
    [Foundation.Switch, Foundation.switchTemplate],
    [Foundation.Tab, Foundation.tabTemplate],
    [Foundation.TabPanel, Foundation.tabPanelTemplate],
    [Foundation.Tabs, Foundation.tabsTemplate],
    [Foundation.TextArea, Foundation.textAreaTemplate],
    [Foundation.TextField, Foundation.textFieldTemplate],
    [Foundation.Toolbar, Foundation.toolbarTemplate],
    [Foundation.TreeItem, Foundation.treeItemTemplate],
    [Foundation.TreeView, Foundation.treeViewTemplate]
];
test.describe("The foundation DOM shim", () => {
    componentsAndTemplates.forEach(([ctor, template]) => {
        const baseName = ctor.name.toLowerCase();
        const prefix = "fast";
        designSystem.withPrefix(prefix).register(ctor.compose({
            baseName,
            template
        }));

        test(`should support construction and connection of the ${ctor.name} component and template during SSR rendering`, () => {
            const { templateRenderer, defaultRenderInfo } = fastSSR();
            const templateString = `<${prefix}-${baseName}></${prefix}-${baseName}>`;
            expect(() => templateRenderer.render(templateString, defaultRenderInfo)).not.toThrow();
        });
    });
})
