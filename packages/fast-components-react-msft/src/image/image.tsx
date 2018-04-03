import * as React from "react";
import * as ReactDOM from "react-dom";
import { Foundation, HandledProps } from "@microsoft/fast-components-react-base";
import { IImageHandledProps, IImageManagedClasses, IImageUnhandledProps } from "./image.props";
import { IBreakpoints } from "@microsoft/fast-components-styles-msft";
import { IImageClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";

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
     * Generates class names using optional props
     */
    generateClassNames() {
        let className = 'c-image' + (this.props ? ' o-round' : '');

        return super.generateClassNames(className);
    }

    /**
     * Generate HTML attributes based on props
     */
    generateAttributes() {
        let attributes = {};

        if (this.props.src) {
            attributes['src'] = this.props.src;
        }

        if (this.props.alt) {
            attributes['alt'] = this.props.alt;
        }

        return attributes;
    }

    /**
     * Generate srcSet attribute value
     */
    generateSrcSet(source) {
        return source ? source : null;
    }

    /**
     * Generate a source element
     */
    generateSourceElement(breakpointsID) {
        let srcset: string = this.props[`vp${breakpointsID}`];
        let vp: IBreakpoints = breakpointsID[`vp${breakpointsID}`];
        let minWidth: number = vp[breakpointsID];

        if (!srcset) {
            return null;
        }

        let minWidthString = minWidth === 0 ? '0' : `${minWidth}px`;

        return <source srcSet={srcset} media={`(min-width: ${minWidthString})`} />;
    }

    /**
     * Renders the component
     */
    render() {
        if (this.props.src) {
            return (
                <img
                    { ...this.unhandledProps() }
                    className={this.generateClassNames()}
                    { ...this.generateAttributes() }
                />
            );
        } else {
            return (
                <picture
                    { ...this.unhandledProps() }
                    className={this.generateClassNames()}
                >
                    { this.generateSourceElement(6) }
                    { this.generateSourceElement(5) }
                    { this.generateSourceElement(4) }
                    { this.generateSourceElement(3) }
                    { this.generateSourceElement(2) }
                    { this.generateSourceElement(1) }
                    { this.props.vp4 ? <img srcSet={this.props.vp4} src={this.props.vp4} alt={this.props.alt} /> : null }
                </picture>
            );
        }
    }
}

export default Image;
export * from "./image.props";
export { IImageClassNameContract };