import * as React from "react";
import { Image, ImageProps } from "../../src/index";

export interface CarouselDarkImageContentProps {
    image: ImageProps;
    className?: string;
}

/**
 * A stand-in dark image
 */
export default class CarouselDarkImageContent extends React.Component<
    CarouselDarkImageContentProps,
    {}
> {
    public static defaultProps: CarouselDarkImageContentProps = {
        image: {
            src: "http://placehold.it/1399x600/2F2F2F/171717",
            alt: "Placeholder image",
        },
    };

    public render(): React.ReactNode {
        return (
            <div className={this.props.className}>
                <Image src={this.props.image.src} alt={this.props.image.alt} />
            </div>
        );
    }
}
