import React from "react";
import { Image } from "../../src/index";

/**
 * A stand-in dark image
 */
export default class CarouselDarkImageContent extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <div {...this.props}>
                <Image
                    src={"http://placehold.it/1399x600/2F2F2F/171717"}
                    alt={"Placeholder image"}
                />
            </div>
        );
    }
}
