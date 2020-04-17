import { ComponentDictionary } from "@microsoft/fast-tooling-react";
import {
    AccentButton,
    Badge,
    CallToAction,
    Card,
    Checkbox,
    Divider,
    Heading,
    Hypertext,
    Image,
    Label,
    LightweightButton,
    NeutralButton,
    NumberField,
    OutlineButton,
    Paragraph,
    Progress,
    StealthButton,
    Subheading,
    TextArea,
    Toggle,
    Typography,
} from "@microsoft/fast-components-react-msft";
import {
    accentButtonSchema,
    badgeSchema,
    callToActionSchema,
    cardSchema,
    checkboxSchema,
    dividerSchema,
    headingSchema,
    hypertextSchema,
    imageSchema,
    labelSchema,
    lightweightButtonSchema,
    neutralButtonSchema,
    numberFieldSchema,
    outlineButtonSchema,
    paragraphSchema,
    progressSchema,
    stealthButtonSchema,
    subheadingSchema,
    textAreaSchema,
    toggleSchema,
    typographySchema,
} from "./";

const componentDictionary: ComponentDictionary = {};
componentDictionary[accentButtonSchema.id] = AccentButton;
componentDictionary[badgeSchema.id] = Badge;
componentDictionary[callToActionSchema.id] = CallToAction;
componentDictionary[cardSchema.id] = Card;
componentDictionary[checkboxSchema.id] = Checkbox;
componentDictionary[dividerSchema.id] = Divider;
componentDictionary[headingSchema.id] = Heading;
componentDictionary[hypertextSchema.id] = Hypertext;
componentDictionary[imageSchema.id] = Image;
componentDictionary[labelSchema.id] = Label;
componentDictionary[lightweightButtonSchema.id] = LightweightButton;
componentDictionary[neutralButtonSchema.id] = NeutralButton;
componentDictionary[numberFieldSchema.id] = NumberField;
componentDictionary[outlineButtonSchema.id] = OutlineButton;
componentDictionary[paragraphSchema.id] = Paragraph;
componentDictionary[progressSchema.id] = Progress;
componentDictionary[stealthButtonSchema.id] = StealthButton;
componentDictionary[subheadingSchema.id] = Subheading;
componentDictionary[textAreaSchema.id] = TextArea;
componentDictionary[toggleSchema.id] = Toggle;
componentDictionary[typographySchema.id] = Typography;

export { componentDictionary };
