import { ComponentDictionary } from "@microsoft/fast-tooling-react";
import {
    AccentButton,
    accentButtonSchema2,
    ActionToggle,
    actionToggleSchema2,
    ActionTrigger,
    actionTriggerSchema2,
    AutoSuggest,
    AutoSuggestOption,
    autoSuggestOptionSchema2,
    autoSuggestSchema2,
    Badge,
    badgeSchema2,
    Breadcrumb,
    breadcrumbSchema2,
    Button,
    buttonSchema2,
    CallToAction,
    callToActionSchema2,
    Caption,
    captionSchema2,
    Card,
    cardSchema2,
    Carousel,
    carouselSchema2,
    Checkbox,
    checkboxSchema2,
    ContextMenu,
    ContextMenuItem,
    contextMenuItemSchema2,
    contextMenuSchema2,
    Dialog,
    dialogSchema2,
    Divider,
    dividerSchema,
    Flipper,
    flipperSchema2,
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
    Metatext,
    metatextSchema2,
    NeutralButton,
    neutralButtonSchema2,
    NumberField,
    numberFieldSchema,
    OutlineButton,
    outlineButtonSchema2,
    Paragraph,
    paragraphSchema2,
    Pivot,
    pivotSchema2,
    Progress,
    progressSchema2,
    Radio,
    radioSchema2,
    Select,
    SelectOption,
    selectOptionSchema2,
    selectSchema2,
    Slider,
    SliderLabel,
    sliderLabelSchema2,
    sliderSchema2,
    StealthButton,
    stealthButtonSchema2,
    Subheading,
    subheadingSchema2,
    TextAction,
    textActionSchema2,
    TextArea,
    textAreaSchema,
    TextField,
    textFieldSchema,
    Toggle,
    toggleSchema2,
    TreeView,
    TreeViewItem,
    treeViewItemSchema2,
    treeViewSchema2,
    Typography,
    typographySchema2,
} from "@microsoft/fast-components-react-msft";
import { designSystemSchema } from "@microsoft/fast-components-styles-msft";

const componentDictionary: ComponentDictionary = {};
componentDictionary[accentButtonSchema2.id] = AccentButton;
componentDictionary[actionToggleSchema2.id] = ActionToggle;
componentDictionary[actionTriggerSchema2.id] = ActionTrigger;
componentDictionary[autoSuggestOptionSchema2.id] = AutoSuggestOption;
componentDictionary[autoSuggestSchema2.id] = AutoSuggest;
componentDictionary[badgeSchema2.id] = Badge;
componentDictionary[breadcrumbSchema2.id] = Breadcrumb;
componentDictionary[buttonSchema2.id] = Button;
componentDictionary[callToActionSchema2.id] = CallToAction;
componentDictionary[captionSchema2.id] = Caption;
componentDictionary[cardSchema2.id] = Card;
componentDictionary[carouselSchema2.id] = Carousel;
componentDictionary[checkboxSchema2.id] = Checkbox;
componentDictionary[contextMenuItemSchema2.id] = ContextMenuItem;
componentDictionary[contextMenuSchema2.id] = ContextMenu;
componentDictionary[designSystemSchema.id] = "";
componentDictionary[dialogSchema2.id] = Dialog;
componentDictionary[dividerSchema.id] = Divider;
componentDictionary[flipperSchema2.id] = Flipper;
componentDictionary[headingSchema2.id] = Heading;
componentDictionary[hypertextSchema2.id] = Hypertext;
componentDictionary[imageSchema.id] = Image;
componentDictionary[labelSchema2.id] = Label;
componentDictionary[lightweightButtonSchema2.id] = LightweightButton;
componentDictionary[metatextSchema2.id] = Metatext;
componentDictionary[neutralButtonSchema2.id] = NeutralButton;
componentDictionary[numberFieldSchema.id] = NumberField;
componentDictionary[outlineButtonSchema2.id] = OutlineButton;
componentDictionary[paragraphSchema2.id] = Paragraph;
componentDictionary[pivotSchema2.id] = Pivot;
componentDictionary[progressSchema2.id] = Progress;
componentDictionary[radioSchema2.id] = Radio;
componentDictionary[selectOptionSchema2.id] = SelectOption;
componentDictionary[selectSchema2.id] = Select;
componentDictionary[sliderLabelSchema2.id] = SliderLabel;
componentDictionary[sliderSchema2.id] = Slider;
componentDictionary[stealthButtonSchema2.id] = StealthButton;
componentDictionary[subheadingSchema2.id] = Subheading;
componentDictionary[textActionSchema2.id] = TextAction;
componentDictionary[textAreaSchema.id] = TextArea;
componentDictionary[textFieldSchema.id] = TextField;
componentDictionary[toggleSchema2.id] = Toggle;
componentDictionary[treeViewItemSchema2.id] = TreeViewItem;
componentDictionary[treeViewSchema2.id] = TreeView;
componentDictionary[typographySchema2.id] = Typography;

export { componentDictionary };
