import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IImageHandledProps, IImageMangedClasses, IImageUnhandledProps } from "./image.props";
import { IImageClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";

/**
 * TODO: Hook viewports values into Styles
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

/* tslint:disable-next-line */
class Image extends Foundation<IImageHandledProps & IManagedClasses<IImageClassNameContract>,  React.HTMLAttributes<HTMLImageElement | HTMLPictureElement>, {}> {
    protected handledProps: HandledProps<IImageHandledProps & IManagedClasses<IImageClassNameContract>> = {
        managedClasses: void 0,
        alt: void(0),
        itemScope: void(0),
        round: void(0),
        src: void(0),
        vp1: void(0),
        vp2: void(0),
        vp3: void(0),
        vp4: void(0),
        vp5: void(0),
        vp6: void(0),
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLImageElement | HTMLPictureElement> {
        if (this.props.src) {
            return (
                <img
                    {...this.unhandledProps()}
                    className={this.generateClassNames()}
                    alt={this.props.alt}
                    src={this.props.src}
                />
            );
        } else {
            const classes: string = this.generateRoundClass(this.props.managedClasses.image);

            return (
                <picture
                    {...this.unhandledProps()}
                    className={this.generateClassNames()}
                >
                    {this.generateSourceElement(6)}
                    {this.generateSourceElement(5)}
                    {this.generateSourceElement(4)}
                    {this.generateSourceElement(3)}
                    {this.generateSourceElement(2)}
                    {this.generateSourceElement(1)}
                    {this.props.vp1 ? <img srcSet={this.props.vp1}src={this.props.vp1} alt={this.props.alt} className={classes}/> : null}
                </picture>
            );
        }
    }

    /**
     * Generates class names using optional props
     */
    protected generateClassNames(): string {
        let classNames: string = this.props.src ? this.props.managedClasses.image : this.props.managedClasses.picture;

        if (this.props.src) {
            classNames = this.generateRoundClass(classNames);
        }

        return super.generateClassNames(classNames);
    }

    private generateRoundClass(className: string): string {
        const classNames: string = this.props.round ? `${className} ${this.props.managedClasses.image_round}` : className;

        return classNames;
    }

    /**
     * Generate a source element
     */
    private generateSourceElement(breakpointsID: any): any {
        const srcset: string = this.props[`vp${breakpointsID}`];
        const vp: number = breakpoints[`vp${breakpointsID}`];
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
