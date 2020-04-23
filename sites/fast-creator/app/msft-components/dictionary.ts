import { ComponentDictionary } from "@microsoft/fast-tooling-react";
import {
    AccentButton,
    accentButtonSchema2,
    Badge,
    badgeSchema2,
    CallToAction,
    callToActionSchema2,
    Card,
    cardSchema2,
    Checkbox,
    checkboxSchema2,
    Divider,
    dividerSchema,
    Heading,
    headingSchema2,
    Hypertext,
    hypertextSchema2,
    Image,
    imageSchema,
    Label,
    labelSchema2,
    LightweightButton,
    lightweightButtonSchema2,
    NeutralButton,
    neutralButtonSchema2,
    NumberField,
    numberFieldSchema,
    OutlineButton,
    outlineButtonSchema2,
    Paragraph,
    paragraphSchema2,
    Progress,
    progressSchema2,
    StealthButton,
    stealthButtonSchema2,
    Subheading,
    subheadingSchema2,
    TextArea,
    textAreaSchema,
    Toggle,
    toggleSchema2,
    Typography,
    typographySchema2,
} from "@microsoft/fast-components-react-msft";

const componentDictionary: ComponentDictionary = {};
componentDictionary[accentButtonSchema2.id] = AccentButton;
componentDictionary[badgeSchema2.id] = Badge;
componentDictionary[callToActionSchema2.id] = CallToAction;
componentDictionary[cardSchema2.id] = Card;
componentDictionary[checkboxSchema2.id] = Checkbox;
componentDictionary[dividerSchema.id] = Divider;
componentDictionary[headingSchema2.id] = Heading;
componentDictionary[hypertextSchema2.id] = Hypertext;
componentDictionary[imageSchema.id] = Image;
componentDictionary[labelSchema2.id] = Label;
componentDictionary[lightweightButtonSchema2.id] = LightweightButton;
componentDictionary[neutralButtonSchema2.id] = NeutralButton;
componentDictionary[numberFieldSchema.id] = NumberField;
componentDictionary[outlineButtonSchema2.id] = OutlineButton;
componentDictionary[paragraphSchema2.id] = Paragraph;
componentDictionary[progressSchema2.id] = Progress;
componentDictionary[stealthButtonSchema2.id] = StealthButton;
componentDictionary[subheadingSchema2.id] = Subheading;
componentDictionary[textAreaSchema.id] = TextArea;
componentDictionary[toggleSchema2.id] = Toggle;
componentDictionary[typographySchema2.id] = Typography;

export { componentDictionary };
