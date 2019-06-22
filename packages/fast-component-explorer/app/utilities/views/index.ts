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
    Badge,
    Breadcrumb,
    Button,
    CallToAction,
    Caption,
    Card,
    Checkbox,
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
    Progress,
    Radio,
    Subheading,
    TextAction,
    TextArea,
    TextField,
    Toggle,
    Typography,
} from "@microsoft/fast-components-react-msft";

import actionToggleSchema from "@microsoft/fast-components-react-msft/dist/action-toggle/action-toggle.schema.json";
import actionTriggerSchema from "@microsoft/fast-components-react-msft/dist/action-trigger/action-trigger.schema.json";
import badgeSchema from "@microsoft/fast-components-react-msft/dist/badge/badge.schema.json";
import breadcrumbSchema from "@microsoft/fast-components-react-msft/dist/breadcrumb/breadcrumb.schema.json";
import buttonSchema from "@microsoft/fast-components-react-msft/dist/button/button.schema.json";
import callToActionSchema from "@microsoft/fast-components-react-msft/dist/call-to-action/call-to-action.schema.json";
import captionSchema from "@microsoft/fast-components-react-msft/dist/caption/caption.schema.json";
import cardSchema from "@microsoft/fast-components-react-msft/dist/card/card.schema.json";
import checkboxSchema from "@microsoft/fast-components-react-msft/dist/checkbox/checkbox.schema.json";
import dialogSchema from "@microsoft/fast-components-react-msft/dist/dialog/dialog.schema.json";
import dividerSchema from "@microsoft/fast-components-react-msft/dist/divider/divider.schema.json";
import flipperSchema from "@microsoft/fast-components-react-msft/dist/flipper/flipper.schema.json";
import headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";
import hypertextSchema from "@microsoft/fast-components-react-msft/dist/hypertext/hypertext.schema.json";
import imageSchema from "@microsoft/fast-components-react-msft/dist/image/image.schema.json";
import labelSchema from "@microsoft/fast-components-react-msft/dist/label/label.schema.json";
import metatextSchema from "@microsoft/fast-components-react-msft/dist/metatext/metatext.schema.json";
import numberFieldSchema from "@microsoft/fast-components-react-msft/dist/number-field/number-field.schema.json";
import paragraphSchema from "@microsoft/fast-components-react-msft/dist/paragraph/paragraph.schema.json";
import progressSchema from "@microsoft/fast-components-react-msft/dist/progress/progress.schema.json";
import radioSchema from "@microsoft/fast-components-react-msft/dist/radio/radio.schema.json";
import subheadingSchema from "@microsoft/fast-components-react-msft/dist/subheading/subheading.schema.json";
import textActionSchema from "@microsoft/fast-components-react-msft/dist/text-action/text-action.schema.json";
import textAreaSchema from "@microsoft/fast-components-react-msft/dist/text-area/text-area.schema.json";
import textFieldSchema from "@microsoft/fast-components-react-msft/dist/text-field/text-field.schema.json";
import toggleSchema from "@microsoft/fast-components-react-msft/dist/toggle/toggle.schema.json";
import typographySchema from "@microsoft/fast-components-react-msft/dist/typography/typography.schema.json";

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
