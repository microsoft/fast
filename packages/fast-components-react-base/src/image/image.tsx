import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { IImageHandledProps, IImageManagedClasses, IImageUnhandledProps } from "./image.props";
import { IImageClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export enum ImageSlot {
    source = "source"
}

/* tslint:disable-next-line */
class Image extends Foundation<IImageHandledProps & IManagedClasses<IImageClassNameContract>, React.HTMLAttributes<HTMLImageElement | HTMLPictureElement>, {}> {
    protected handledProps: HandledProps<IImageHandledProps & IManagedClasses<IImageClassNameContract>> = {
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
                    {this.renderChildrenBySlot(ImageSlot.source)}
                    <img
                        src={this.props.src}
                        alt={this.props.alt}
                        className={get(this.props, "managedClasses.image_img")}
                    />
                </picture>
            );
        }
    }

    /**
     * Render children by slot
     */
    private renderChildrenBySlot(slot: ImageSlot): Array<React.ReactElement<HTMLSourceElement>> {
        return React.Children.map(
            this.props.children,
            (child: React.ReactElement<HTMLSourceElement>, index: number): React.ReactElement<HTMLSourceElement> => {
                if (child.props && child.props.slot === slot) {
                    return child;
                }
            });
    }
}

export default Image;
export * from "./image.props";
export {IImageClassNameContract};
