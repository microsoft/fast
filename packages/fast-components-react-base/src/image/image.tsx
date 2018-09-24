import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { IImageHandledProps, IImageManagedClasses, IImageUnhandledProps } from "./image.props";
import { IImageClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * TODO #239 #240: Hook viewports values into Styles
 */
export interface IBreakpoints {
    vp1: number;
    vp2: number;
    vp3: number;
    vp4: number;
    vp5: number;
    vp6: number;
}

const breakpoints: IBreakpoints = {
    vp1: 0,
    vp2: 540,
    vp3: 768,
    vp4: 1084,
    vp5: 1400,
    vp6: 1779
};

class Image extends Foundation<
    IImageHandledProps & IManagedClasses<IImageClassNameContract>,
    React.HTMLAttributes<HTMLImageElement | HTMLPictureElement>,
    {}
> {
    public static displayName: string = "Image";

    protected handledProps: HandledProps<IImageHandledProps & IManagedClasses<IImageClassNameContract>> = {
        managedClasses: void 0,
        alt: void(0),
        itemScope: void(0),
        round: void(0),
        sizes: void(0),
        src: void(0),
        srcSet: void(0),
        vp1: void(0),
        vp2: void(0),
        vp3: void(0),
        vp4: void(0),
        vp5: void(0),
        vp6: void(0)
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLImageElement | HTMLPictureElement> {
        if (!this.props.src && !this.props.vp1) {
            return;
        }

        if (this.props.src) {
            return (
                <img
                    {...this.unhandledProps()}
                    className={this.generateClasses()}
                    alt={this.props.alt}
                    sizes={this.props.sizes ? this.props.sizes : null}
                    src={this.props.src}
                    srcSet={this.props.srcSet ? this.props.srcSet : null}
                />
            );
        } else {
            return (
                <picture
                    {...this.unhandledProps()}
                    className={this.generateClasses()}
                >
                    {this.generateSourceElement(6)}
                    {this.generateSourceElement(5)}
                    {this.generateSourceElement(4)}
                    {this.generateSourceElement(3)}
                    {this.generateSourceElement(2)}
                    {this.generateSourceElement(1)}
                    <img src={this.props.vp1} alt={this.props.alt} className={this.generateClasses(true)}/>
                </picture>
            );
        }
    }

    /**
     * Generates class names using optional props
     */
    protected generateClasses(isNestedImage: boolean = false): string {
        let classNames: string = this.props.src || isNestedImage ?
            get(this.props, "managedClasses.image") : get(this.props, "managedClasses.picture");

        if (this.props.src || isNestedImage) {
            classNames = this.props.round ? `${classNames} ${get(this.props, "managedClasses.image_round")}` : classNames;
        }

        if (isNestedImage) {
            return classNames;
        }

        return super.generateClassNames(classNames);
    }

    /**
     * Generate a source element
     */
    private generateSourceElement(breakpointsId: number): any {
        const srcset: string = this.props[`vp${breakpointsId}`];
        const vp: number = breakpoints[`vp${breakpointsId}`];
        const minWidth: number = vp;

        if (!srcset) {
            return null;
        }

        const minWidthString: string = minWidth === 0 ? "0" : `${minWidth}px`;

        return <source srcSet={srcset} media={`(min-width: ${minWidthString})`} />;
    }
}

export default Image;
export * from "./image.props";
export {IImageClassNameContract};
