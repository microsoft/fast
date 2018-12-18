import React from "react";
import { Image } from "../../src/index";

/**
 * A stand-in light image
 */
export default class CarouselLightImageContent extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <div {...this.props}>
                <Image
                    src={"http://placehold.it/1399x600/DDD/222"}
                    alt={"Placeholder image"}
                />
            </div>
        );
    }
}
