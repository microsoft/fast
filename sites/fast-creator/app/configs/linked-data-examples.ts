import { Data } from "@microsoft/fast-tooling";
import { uniqueId } from "lodash-es";
import {
    fastComponentSchemas,
    fluentComponentSchemas,
    nativeElementSchemas,
    textSchema,
} from "@microsoft/site-utilities";

interface ExampleData {
    [key: string]: Array<Data<unknown>>;
}

/**
 * FAST component tags
 */
export const fastAnchorTag = "fast-anchor";
export const fastBadgeTag = "fast-badge";
export const fastButtonTag = "fast-button";
export const fastCardTag = "fast-card";
export const fastCheckboxTag = "fast-checkbox";
export const fastDialogTag = "fast-dialog";
export const fastDividerTag = "fast-divider";
export const fastFlipperTag = "fast-flipper";
export const fastMenuTag = "fast-menu";
export const fastProgressTag = "fast-progress";
export const fastProgressRingTag = "fast-progress-ring";
export const fastRadioGroupTag = "fast-radio-group";
export const fastRadioTag = "fast-radio";
export const fastSliderTag = "fast-slider";
export const fastSliderLabelTag = "fast-slider-label";
export const fastSwitchTag = "fast-switch";
export const fastTabsTag = "fast-tabs";
export const fastTabTag = "fast-tab";
export const fastTabPanelTag = "fast-tab-panel";
export const fastMenuItemTag = "fast-menu-item";
export const fastTextAreaTag = "fast-text-area";
export const fastTextFieldTag = "fast-text-field";

/**
 * Fluent component tags
 */
export const fluentAnchorTag = "fluent-anchor";
export const fluentBadgeTag = "fluent-badge";
export const fluentButtonTag = "fluent-button";
export const fluentCardTag = "fluent-card";
export const fluentCheckboxTag = "fluent-checkbox";
export const fluentDialogTag = "fluent-dialog";
export const fluentDividerTag = "fluent-divider";
export const fluentFlipperTag = "fluent-flipper";
export const fluentMenuTag = "fluent-menu";
export const fluentProgressTag = "fluent-progress";
export const fluentProgressRingTag = "fluent-progress-ring";
export const fluentRadioGroupTag = "fluent-radio-group";
export const fluentRadioTag = "fluent-radio";
export const fluentSliderTag = "fluent-slider";
export const fluentSliderLabelTag = "fluent-slider-label";
export const fluentSwitchTag = "fluent-switch";
export const fluentTabsTag = "fluent-tabs";
export const fluentTabTag = "fluent-tab";
export const fluentTabPanelTag = "fluent-tab-panel";
export const fluentMenuItemTag = "fluent-menu-item";
export const fluentTextAreaTag = "fluent-text-area";
export const fluentTextFieldTag = "fluent-text-field";

/**
 * Native element tags
 */
export const divTag = "div";
export const imageTag = "img";
export const paragraphTag = "p";
export const spanTag = "span";
export const heading1Tag = "h1";
export const heading2Tag = "h2";
export const heading3Tag = "h3";
export const heading4Tag = "h4";
export const heading5Tag = "h5";
export const heading6Tag = "h6";
export const labelTag = "label";

/**
 * Native element examples
 */
const imageExample = {
    schemaId: nativeElementSchemas[imageTag].id,
    data: {
        src: "https://via.placeholder.com/320x180",
    },
    dataLocation: "Slot",
};

const heading1Example = {
    schemaId: nativeElementSchemas[heading1Tag].id,
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

const heading2Example = {
    schemaId: nativeElementSchemas[heading2Tag].id,
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

const heading3Example = {
    schemaId: nativeElementSchemas[heading3Tag].id,
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

const heading4Example = {
    schemaId: nativeElementSchemas[heading4Tag].id,
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

const heading5Example = {
    schemaId: nativeElementSchemas[heading5Tag].id,
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

const heading6Example = {
    schemaId: nativeElementSchemas[heading6Tag].id,
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

const paragraphExample = {
    schemaId: nativeElementSchemas[paragraphTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        {
            schemaId: textSchema.id,
            data:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id ante non massa vulputate facilisis. Vestibulum ac consequat sem. Etiam sodales turpis nec ante hendrerit, ut cursus risus sollicitudin. Curabitur et suscipit ex, sit amet faucibus neque. In ac nunc elementum, porta purus sed, scelerisque dui. Nullam ut tincidunt mi, id imperdiet risus. Curabitur a metus in ligula pellentesque pellentesque. Vivamus porta velit sollicitudin turpis aliquam, sit amet accumsan purus gravida. Etiam euismod ex neque, vel lobortis ligula semper ac.",
            dataLocation: "Slot",
        },
    ],
};

const divExample = {
    schemaId: nativeElementSchemas[divTag].id,
    data: {},
    dataLocation: "Slot",
};

const spanExample = {
    schemaId: nativeElementSchemas[spanTag].id,
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

const labelExample = {
    schemaId: nativeElementSchemas[labelTag].id,
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

/**
 * FAST examples
 */
const fastAnchorExample = {
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
const fastButtonExample = {
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
const fastBadgeExample = {
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
const fastCardExample = {
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
const fastCheckboxExample = {
    schemaId: fastComponentSchemas[fastCheckboxTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastDialogExample = {
    schemaId: fastComponentSchemas[fastDialogTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastDividerExample = {
    schemaId: fastComponentSchemas[fastDividerTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastFlipperExample = {
    schemaId: fastComponentSchemas[fastFlipperTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastMenuItemExample = {
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
const fastMenuExample = {
    schemaId: fastComponentSchemas[fastMenuTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [fastMenuItemExample, fastMenuItemExample, fastMenuItemExample],
};
const fastProgressExample = {
    schemaId: fastComponentSchemas[fastProgressTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastProgressRingExample = {
    schemaId: fastComponentSchemas[fastProgressRingTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastRadioGroupExample = {
    schemaId: fastComponentSchemas[fastRadioGroupTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastRadioExample = {
    schemaId: fastComponentSchemas[fastRadioTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastSliderExample = {
    schemaId: fastComponentSchemas[fastSliderTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastSliderLabelExample = {
    schemaId: fastComponentSchemas[fastSliderLabelTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastSwitchExample = {
    schemaId: fastComponentSchemas[fastSwitchTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastTabExample = {
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
const fastTabPanelExample = {
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
const fastTabsExample = {
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
const fastTextAreaExample = {
    schemaId: fastComponentSchemas[fastTextAreaTag].id,
    data: {},
    dataLocation: "Slot",
};
const fastTextFieldExample = {
    schemaId: fastComponentSchemas[fastTextFieldTag].id,
    data: {},
    dataLocation: "Slot",
};
/**
 * Fluent examples
 */
const fluentAnchorExample = {
    schemaId: fluentComponentSchemas[fluentAnchorTag].id,
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
const fluentButtonExample = {
    schemaId: fluentComponentSchemas[fluentButtonTag].id,
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
const fluentBadgeExample = {
    schemaId: fluentComponentSchemas[fluentBadgeTag].id,
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
const fluentCardExample = {
    schemaId: fluentComponentSchemas[fluentCardTag].id,
    data: {
        style: "width: 320px",
    },
    dataLocation: "Slot",
    linkedData: [
        imageExample,
        {
            ...fluentBadgeExample,
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
            ...fluentButtonExample,
            data: {
                style: "margin: 10px",
            },
        },
    ],
};
const fluentCheckboxExample = {
    schemaId: fluentComponentSchemas[fluentCheckboxTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentDialogExample = {
    schemaId: fluentComponentSchemas[fluentDialogTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentDividerExample = {
    schemaId: fluentComponentSchemas[fluentDividerTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentFlipperExample = {
    schemaId: fluentComponentSchemas[fluentFlipperTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentMenuItemExample = {
    schemaId: fluentComponentSchemas[fluentMenuItemTag].id,
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
const fluentMenuExample = {
    schemaId: fluentComponentSchemas[fluentMenuTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [fluentMenuItemExample, fluentMenuItemExample, fluentMenuItemExample],
};
const fluentProgressExample = {
    schemaId: fluentComponentSchemas[fluentProgressTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentProgressRingExample = {
    schemaId: fluentComponentSchemas[fluentProgressRingTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentRadioGroupExample = {
    schemaId: fluentComponentSchemas[fluentRadioGroupTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentRadioExample = {
    schemaId: fluentComponentSchemas[fluentRadioTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentSliderExample = {
    schemaId: fluentComponentSchemas[fluentSliderTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentSliderLabelExample = {
    schemaId: fluentComponentSchemas[fluentSliderLabelTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentSwitchExample = {
    schemaId: fluentComponentSchemas[fluentSwitchTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentTabExample = {
    schemaId: fluentComponentSchemas[fluentTabTag].id,
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
const fluentTabPanelExample = {
    schemaId: fluentComponentSchemas[fluentTabPanelTag].id,
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
const fluentTabsExample = {
    schemaId: fluentComponentSchemas[fluentTabsTag].id,
    data: {},
    dataLocation: "Slot",
    linkedData: [
        { ...fluentTabExample, data: { id: uniqueId("Tab") } },
        { ...fluentTabExample, data: { id: uniqueId("Tab") } },
        { ...fluentTabExample, data: { id: uniqueId("Tab") } },
        { ...fluentTabPanelExample, data: { id: uniqueId("Tabpanel") } },
        { ...fluentTabPanelExample, data: { id: uniqueId("Tabpanel") } },
        { ...fluentTabPanelExample, data: { id: uniqueId("Tabpanel") } },
    ],
};
const fluentTextAreaExample = {
    schemaId: fluentComponentSchemas[fluentTextAreaTag].id,
    data: {},
    dataLocation: "Slot",
};
const fluentTextFieldExample = {
    schemaId: fluentComponentSchemas[fluentTextFieldTag].id,
    data: {},
    dataLocation: "Slot",
};

const linkedDataExamples: ExampleData = {
    /**
     * FAST components
     */
    [fastComponentSchemas[fastAnchorTag].id]: [fastAnchorExample],
    [fastComponentSchemas[fastButtonTag].id]: [fastButtonExample],
    [fastComponentSchemas[fastBadgeTag].id]: [fastBadgeExample],
    [fastComponentSchemas[fastCardTag].id]: [fastCardExample],
    [fastComponentSchemas[fastCheckboxTag].id]: [fastCheckboxExample],
    [fastComponentSchemas[fastDialogTag].id]: [fastDialogExample],
    [fastComponentSchemas[fastDividerTag].id]: [fastDividerExample],
    [fastComponentSchemas[fastFlipperTag].id]: [fastFlipperExample],
    [fastComponentSchemas[fastMenuTag].id]: [fastMenuExample],
    [fastComponentSchemas[fastMenuItemTag].id]: [fastMenuItemExample],
    [fastComponentSchemas[fastProgressTag].id]: [fastProgressExample],
    [fastComponentSchemas[fastProgressRingTag].id]: [fastProgressRingExample],
    [fastComponentSchemas[fastRadioGroupTag].id]: [fastRadioGroupExample],
    [fastComponentSchemas[fastRadioTag].id]: [fastRadioExample],
    [fastComponentSchemas[fastSliderTag].id]: [fastSliderExample],
    [fastComponentSchemas[fastSliderLabelTag].id]: [fastSliderLabelExample],
    [fastComponentSchemas[fastSwitchTag].id]: [fastSwitchExample],
    [fastComponentSchemas[fastTabsTag].id]: [fastTabsExample],
    [fastComponentSchemas[fastTabTag].id]: [fastTabExample],
    [fastComponentSchemas[fastTabPanelTag].id]: [fastTabPanelExample],
    [fastComponentSchemas[fastTextAreaTag].id]: [fastTextAreaExample],
    [fastComponentSchemas[fastTextFieldTag].id]: [fastTextFieldExample],
    /**
     * Fluent components
     */
    [fluentComponentSchemas[fluentAnchorTag].id]: [fluentAnchorExample],
    [fluentComponentSchemas[fluentButtonTag].id]: [fluentButtonExample],
    [fluentComponentSchemas[fluentBadgeTag].id]: [fluentBadgeExample],
    [fluentComponentSchemas[fluentCardTag].id]: [fluentCardExample],
    [fluentComponentSchemas[fluentCheckboxTag].id]: [fluentCheckboxExample],
    [fluentComponentSchemas[fluentDialogTag].id]: [fluentDialogExample],
    [fluentComponentSchemas[fluentDividerTag].id]: [fluentDividerExample],
    [fluentComponentSchemas[fluentFlipperTag].id]: [fluentFlipperExample],
    [fluentComponentSchemas[fluentMenuTag].id]: [fluentMenuExample],
    [fluentComponentSchemas[fluentMenuItemTag].id]: [fluentMenuItemExample],
    [fluentComponentSchemas[fluentProgressTag].id]: [fluentProgressExample],
    [fluentComponentSchemas[fluentProgressRingTag].id]: [fluentProgressRingExample],
    [fluentComponentSchemas[fluentRadioGroupTag].id]: [fluentRadioGroupExample],
    [fluentComponentSchemas[fluentRadioTag].id]: [fluentRadioExample],
    [fluentComponentSchemas[fluentSliderTag].id]: [fluentSliderExample],
    [fluentComponentSchemas[fluentSliderLabelTag].id]: [fluentSliderLabelExample],
    [fluentComponentSchemas[fluentSwitchTag].id]: [fluentSwitchExample],
    [fluentComponentSchemas[fluentTabsTag].id]: [fluentTabsExample],
    [fluentComponentSchemas[fluentTabTag].id]: [fluentTabExample],
    [fluentComponentSchemas[fluentTabPanelTag].id]: [fluentTabPanelExample],
    [fluentComponentSchemas[fluentTextAreaTag].id]: [fluentTextAreaExample],
    [fluentComponentSchemas[fluentTextFieldTag].id]: [fluentTextFieldExample],
    /**
     * Native elements
     */
    [nativeElementSchemas[divTag].id]: [divExample],
    [nativeElementSchemas[imageTag].id]: [imageExample],
    [nativeElementSchemas[paragraphTag].id]: [paragraphExample],
    [nativeElementSchemas[spanTag].id]: [spanExample],
    [nativeElementSchemas[heading1Tag].id]: [heading1Example],
    [nativeElementSchemas[heading2Tag].id]: [heading2Example],
    [nativeElementSchemas[heading3Tag].id]: [heading3Example],
    [nativeElementSchemas[heading4Tag].id]: [heading4Example],
    [nativeElementSchemas[heading5Tag].id]: [heading5Example],
    [nativeElementSchemas[heading6Tag].id]: [heading6Example],
    [nativeElementSchemas[labelTag].id]: [labelExample],
};

export { linkedDataExamples };
