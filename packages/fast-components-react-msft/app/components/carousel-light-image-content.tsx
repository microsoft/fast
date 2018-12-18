import React from "react";
<<<<<<< HEAD
import { Image, ImageProps } from "../../src/index";

export interface CarouselLightImageContentProps {
    image: ImageProps;
    className?: string;
}
=======
import { Image } from "../../src/index";
>>>>>>> fix: update to use esModuleInterop in the TypeScript configuration files (#1211)

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
