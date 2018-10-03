import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { IImageHandledProps, IImageManagedClasses, IImageUnhandledProps } from "./image.props";
import { IImageClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export enum ImageSlot {
    source = "source"
}

class Image extends Foundation<
    IImageHandledProps,
    IImageUnhandledProps,
    {}
> {
    public static displayName: string = "Image";

    protected handledProps: HandledProps<IImageHandledProps> = {
        managedClasses: void 0,
        alt: void(0),
        sizes: void(0),
        src: void(0),
        srcSet: void(0)
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLImageElement | HTMLPictureElement> {
        let className: string = get(this.props, "managedClasses.image");

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
            className = `${className} ${get(this.props, "managedClasses.image__picture")}`;

            return (
                <picture
                    {...this.unhandledProps()}
                    className={super.generateClassNames(className)}
                >
                    {this.withSlot(ImageSlot.source)}
                    <img
                        src={this.props.src}
                        alt={this.props.alt}
                        className={get(this.props, "managedClasses.image_img")}
                    />
                </picture>
            );
        }
    }
}

export default Image;
export * from "./image.props";
export {IImageClassNameContract};
