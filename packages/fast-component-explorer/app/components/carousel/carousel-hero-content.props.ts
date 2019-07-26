import {
    CallToActionProps,
    HeadingProps,
    ImageProps,
    ParagraphProps,
} from "@microsoft/fast-components-react-msft";

export interface CarouselHeroContentProps {
    heading?: HeadingProps;
    paragraph?: ParagraphProps;
    callToAction?: CallToActionProps;
    image?: ImageProps;
    className?: string;
}
