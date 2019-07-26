import React from "react";
import { Image } from "@microsoft/fast-components-react-msft";
import { CarouselLightImageContentProps } from "./carousel-light-image-content.props";

/**
 * A stand-in light image
 */
export default class CarouselLightImageContent extends React.Component<
    CarouselLightImageContentProps,
    {}
> {
    public static defaultProps: CarouselLightImageContentProps = {
        image: {
            src: "http://placehold.it/1399x600/DDD/222",
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
