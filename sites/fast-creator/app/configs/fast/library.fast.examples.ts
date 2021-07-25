import { fastComponentSchemas, textSchema } from "@microsoft/site-utilities";
import { uniqueId } from "lodash-es";
import {
    heading2Example,
    imageExample,
    paragraphExample,
} from "../native/library.native.examples";
import {
    fastAnchorTag,
    fastBadgeTag,
    fastButtonTag,
    fastCardTag,
    fastCheckboxTag,
    fastDialogTag,
    fastDividerTag,
    fastFlipperTag,
    fastMenuItemTag,
    fastMenuTag,
    fastProgressRingTag,
    fastProgressTag,
    fastRadioGroupTag,
    fastRadioTag,
    fastSliderLabelTag,
    fastSliderTag,
    fastSwitchTag,
    fastTabPanelTag,
    fastTabsTag,
    fastTabTag,
    fastTextAreaTag,
    fastTextFieldTag,
} from "./library.fast.tags";

export const fastAnchorExample = {
    schemaId: fastComponentSchemas[fastAnchorTag].id,
    data: {
        href: "#",
    },
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: "Anchor",
            dataLocation: "Slot",
        },
    ],
};
export const fastButtonExample = {
    schemaId: fastComponentSchemas[fastButtonTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: "Button",
            dataLocation: "Slot",
        },
    ],
};
export const fastBadgeExample = {
    schemaId: fastComponentSchemas[fastBadgeTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: "LOREM",
            dataLocation: "Slot",
        },
    ],
};
export const fastCardExample = {
    schemaId: fastComponentSchemas[fastCardTag].id,
    data: {
        style: "width: 320px",
    },
    dataLocation: "Slot",
    linkedData: [
        imageExample,
        {
            ...fastBadgeExample,
            data: {
                style:
                    "margin: 5px 10px; --badge-fill-fill: #3278cd; --badge-color-color: white;",
                fill: "fill",
                color: "color",
            },
        },
        {
            ...heading2Example,
            data: {
                style: "margin: 5px 10px",
            },
        },
        {
            ...paragraphExample,
            data: {
                style: "margin: 0 10px",
            },
        },
        {
            ...fastButtonExample,
            data: {
                style: "margin: 10px",
            },
        },
    ],
};
export const fastCheckboxExample = {
    schemaId: fastComponentSchemas[fastCheckboxTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: "Lorem ipsum",
            dataLocation: "Slot",
        },
    ],
};
export const fastDialogExample = {
    schemaId: fastComponentSchemas[fastDialogTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastDividerExample = {
    schemaId: fastComponentSchemas[fastDividerTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastFlipperExample = {
    schemaId: fastComponentSchemas[fastFlipperTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastMenuItemExample = {
    schemaId: fastComponentSchemas[fastMenuItemTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: "Lorem ipsum sit amet",
            dataLocation: "Slot",
        },
    ],
};
export const fastMenuExample = {
    schemaId: fastComponentSchemas[fastMenuTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [fastMenuItemExample, fastMenuItemExample, fastMenuItemExample],
};
export const fastProgressExample = {
    schemaId: fastComponentSchemas[fastProgressTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastProgressRingExample = {
    schemaId: fastComponentSchemas[fastProgressRingTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastRadioGroupExample = {
    schemaId: fastComponentSchemas[fastRadioGroupTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastRadioExample = {
    schemaId: fastComponentSchemas[fastRadioTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastSliderExample = {
    schemaId: fastComponentSchemas[fastSliderTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastSliderLabelExample = {
    schemaId: fastComponentSchemas[fastSliderLabelTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastSwitchExample = {
    schemaId: fastComponentSchemas[fastSwitchTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastTabExample = {
    schemaId: fastComponentSchemas[fastTabTag].id,
    data: {
        id: uniqueId("Tab"),
    },
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data: "Lorem ipsum sit amet",
            dataLocation: "Slot",
        },
    ],
};
export const fastTabPanelExample = {
    schemaId: fastComponentSchemas[fastTabPanelTag].id,
    data: {
        id: uniqueId("TabPanel"),
    },
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id ante non massa vulputate facilisis. Vestibulum ac consequat sem. Etiam sodales turpis nec ante hendrerit, ut cursus risus sollicitudin. Curabitur et suscipit ex, sit amet faucibus neque. In ac nunc elementum, porta purus sed, scelerisque dui. Nullam ut tincidunt mi, id imperdiet risus. Curabitur a metus in ligula pellentesque pellentesque. Vivamus porta velit sollicitudin turpis aliquam, sit amet accumsan purus gravida. Etiam euismod ex neque, vel lobortis ligula semper ac. Proin eget metus vel turpis tempus accumsan. Aenean rhoncus ex lectus, a tincidunt justo volutpat quis. Sed id tincidunt purus. Phasellus ultrices, magna id viverra pellentesque, nisl turpis ullamcorper metus, sed varius nunc magna ut lacus.",
            dataLocation: "Slot",
        },
    ],
};
export const fastTabsExample = {
    schemaId: fastComponentSchemas[fastTabsTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        { ...fastTabExample, data: { id: uniqueId("Tab") } },
        { ...fastTabExample, data: { id: uniqueId("Tab") } },
        { ...fastTabExample, data: { id: uniqueId("Tab") } },
        { ...fastTabPanelExample, data: { id: uniqueId("Tabpanel") } },
        { ...fastTabPanelExample, data: { id: uniqueId("Tabpanel") } },
        { ...fastTabPanelExample, data: { id: uniqueId("Tabpanel") } },
    ],
};
export const fastTextAreaExample = {
    schemaId: fastComponentSchemas[fastTextAreaTag].id,
    data: {},
    dataLocation: "Slot",
};
export const fastTextFieldExample = {
    schemaId: fastComponentSchemas[fastTextFieldTag].id,
    data: {},
    dataLocation: "Slot",
};
