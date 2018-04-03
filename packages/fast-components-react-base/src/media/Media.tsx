import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import {IMediaHandledProps, IMediaMangedClasses, IMediaUnhandledProps, IMediaSourceSet} from "./media.props";
import {IMediaClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

/* tslint:disable-next-line */
class Media extends Foundation<IMediaHandledProps & IMediaMangedClasses,  IMediaUnhandledProps, {}> {
    protected handledProps: HandledProps<IMediaHandledProps & IManagedClasses<IMediaClassNameContract>> = {
        managedClasses: void 0
    };

    generateSrcSetString() {
        let imgSrcSet = this.props.mediaSrcSet.map((item , index) => {
            return item.srcSet
        });

        return imgSrcSet.join(", ");
    }

    generatePicture(): React.ReactElement<HTMLPictureElement> {
        let sources = this.props.mediaSrcSet.map((item , index) => {
        let maxWidth = (item.maxWidth != null) ? `(max-width: ${item.maxWidth})` : "";
        let and = (item.maxWidth != null && item.minWidth != null) ? ` and ` : "";
        let minWidth = (item.minWidth != null) ? `(min-width: ${item.minWidth})`: "";
        return (
            <source key={index} srcSet={item.srcSet} media={minWidth + and + maxWidth}/>
        );
        });

        return (
        <picture
            className={this.generateClassNames()}>
            {sources}
            <img srcSet={this.props.mediaSrcSet[0].srcSet} src={this.props.mediaSrcSet[0].srcSet} alt={this.props.alt} />
        </picture>
        );
    }

    generateSimpleImage(): React.ReactElement<HTMLImageElement> {
        return (
            <img
                className={this.generateClassNames()}
                src={this.props.src}
                srcSet={this.generateSrcSetString()}
                alt={this.props.alt}
                sizes={this.props.sizes}/>
        );
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLImageElement | HTMLPictureElement> {
        return (
             (this.props.src) ? this.generateSimpleImage() : this.generatePicture()
        );
    }
}

export default Media;
export * from "./media.props";
export {IMediaClassNameContract};

