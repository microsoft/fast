import { ProjectFileView } from "../../explorer.props";
import designSystemSchema from "../../msft-component-helpers/design-system.schema.json";
import groupSchema from "../../components/group/group.schema.json";
import { FormChildOptionItem } from "@microsoft/fast-tooling-react/dist/form/form";
import { Group } from "../../components";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { pascalCase } from "@microsoft/fast-web-utilities";
import {
    ActionToggle,
    ActionTrigger,
    AutoSuggest,
    Badge,
    Breadcrumb,
    Button,
    CallToAction,
    Caption,
    Card,
    Carousel,
    Checkbox,
    ContextMenu,
    ContextMenuItem,
    Dialog,
    Divider,
    Flipper,
    Heading,
    Hypertext,
    Image,
    Label,
    Metatext,
    NumberField,
    Paragraph,
    Pivot,
    Progress,
    Radio,
    Select,
    Slider,
    SliderLabel,
    Subheading,
    TextAction,
    TextArea,
    TextField,
    Toggle,
    Typography,
} from "@microsoft/fast-components-react-msft";
import {
    actionToggleSchema,
    actionTriggerSchema,
    autoSuggestSchema,
    autoSuggestOptionSchema,
    badgeSchema,
    breadcrumbSchema,
    buttonSchema,
    callToActionSchema,
    captionSchema,
    cardSchema,
    carouselSchema,
    checkboxSchema,
    contextMenuSchema,
    contextMenuItemSchema,
    dialogSchema,
    dividerSchema,
    flipperSchema,
    headingSchema,
    hypertextSchema,
    imageSchema,
    labelSchema,
    metatextSchema,
    numberFieldSchema,
    paragraphSchema,
    pivotSchema,
    progressSchema,
    radioSchema,
    selectSchema,
    selectOptionSchema,
    sliderSchema,
    sliderLabelSchema,
    subheadingSchema,
    textActionSchema,
    textAreaSchema,
    textFieldSchema,
    toggleSchema,
    typographySchema,
} from "@microsoft/fast-components-react-msft";

export function getInitialView(): ProjectFileView {
    const projectFileView: ProjectFileView = {
        data: {
            id: designSystemSchema.id,
            props: {
                children: {
                    id: groupSchema.id,
                    props: {},
                },
            },
        },
    };

    return projectFileView;
}

export function getChildrenOptions(): FormChildOptionItem[] {
    return [
        {
            name: groupSchema.title,
            component: Group,
            schema: groupSchema,
        },
        {
            name: pascalCase(designSystemSchema.title),
            component: DesignSystemProvider,
            schema: designSystemSchema,
        },
        {
            name: pascalCase(actionToggleSchema.title),
            component: ActionToggle,
            schema: actionToggleSchema,
        },
        {
            name: pascalCase(actionTriggerSchema.title),
            component: ActionTrigger,
            schema: actionTriggerSchema,
        },
        {
            name: badgeSchema.title,
            component: Badge,
            schema: badgeSchema,
        },
        {
            name: breadcrumbSchema.title,
            component: Breadcrumb,
            schema: breadcrumbSchema,
        },
        {
            name: buttonSchema.title,
            component: Button,
            schema: buttonSchema,
        },
        {
            name: pascalCase(callToActionSchema.title),
            component: CallToAction,
            schema: callToActionSchema,
        },
        {
            name: captionSchema.title,
            component: Caption,
            schema: captionSchema,
        },
        {
            name: cardSchema.title,
            component: Card,
            schema: cardSchema,
        },
        {
            name: checkboxSchema.title,
            component: Checkbox,
            schema: checkboxSchema,
        },
        {
            name: dialogSchema.title,
            component: Dialog,
            schema: dialogSchema,
        },
        {
            name: dividerSchema.title,
            component: Divider,
            schema: dividerSchema,
        },
        {
            name: flipperSchema.title,
            component: Flipper,
            schema: flipperSchema,
        },
        {
            name: headingSchema.title,
            component: Heading,
            schema: headingSchema,
        },
        {
            name: hypertextSchema.title,
            component: Hypertext,
            schema: hypertextSchema,
        },
        {
            name: imageSchema.title,
            component: Image,
            schema: imageSchema,
        },
        {
            name: labelSchema.title,
            component: Label,
            schema: labelSchema,
        },
        {
            name: metatextSchema.title,
            component: Metatext,
            schema: metatextSchema,
        },
        {
            name: pascalCase(numberFieldSchema.title),
            component: NumberField,
            schema: numberFieldSchema,
        },
        {
            name: paragraphSchema.title,
            component: Paragraph,
            schema: paragraphSchema,
        },
        {
            name: progressSchema.title,
            component: Progress,
            schema: progressSchema,
        },
        {
            name: radioSchema.title,
            component: Radio,
            schema: radioSchema,
        },
        {
            name: subheadingSchema.title,
            component: Subheading,
            schema: subheadingSchema,
        },
        {
            name: pascalCase(textActionSchema.title),
            component: TextAction,
            schema: textActionSchema,
        },
        {
            name: pascalCase(textAreaSchema.title),
            component: TextArea,
            schema: textAreaSchema,
        },
        {
            name: pascalCase(textFieldSchema.title),
            component: TextField,
            schema: textFieldSchema,
        },
        {
            name: toggleSchema.title,
            component: Toggle,
            schema: toggleSchema,
        },
        {
            name: typographySchema.title,
            component: Typography,
            schema: typographySchema,
        },
    ];
}
