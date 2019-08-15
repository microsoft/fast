import { ImageClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import { get } from "lodash-es";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import { ImageHandledProps, ImageProps, ImageUnhandledProps } from "./image.props";

export enum ImageSlot {
    source = "source",
}

class Image extends Foundation<ImageHandledProps, ImageUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Image`;

    public static defaultProps: Partial<ImageProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<ImageHandledProps> = {
        managedClasses: void 0,
        alt: void 0,
        sizes: void 0,
        src: void 0,
        srcSet: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLImageElement | HTMLPictureElement> {
        let className: string = classNames(this.props.managedClasses.image);

        if (!this.props.children) {
            return (
                <img
                    {...this.unhandledProps()}
                    className={super.generateClassNames(className)}
                    alt={this.props.alt}
                    sizes={this.props.sizes ? this.props.sizes : null}
                    src={this.props.src}
                    srcSet={this.props.srcSet ? this.props.srcSet : null}
                />
            );
        } else {
            className = `${className} ${get(
                this.props,
                "managedClasses.image__picture",
                ""
            )}`;

            return (
                <picture
                    {...this.unhandledProps()}
                    className={super.generateClassNames(className)}
                >
                    {this.withSlot(ImageSlot.source)}
                    <img
                        src={this.props.src}
                        alt={this.props.alt}
                        className={get(this.props, "managedClasses.image_img", "")}
                    />
                </picture>
            );
        }
    }
}

export default Image;
export * from "./image.props";
export { ImageClassNameContract };
