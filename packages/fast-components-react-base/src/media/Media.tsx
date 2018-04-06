import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IMediaHandledProps, IMediaMangedClasses, IMediaSourceSet, IMediaUnhandledProps } from "./media.props";
import { IManagedClasses, IMediaClassNameContract } from "@microsoft/fast-components-class-name-contracts";

/* tslint:disable-next-line */
class Media extends Foundation<IMediaHandledProps & IManagedClasses<IMediaClassNameContract>,  React.HTMLAttributes<HTMLImageElement | HTMLPictureElement>, {}> {
    protected handledProps: HandledProps<IMediaHandledProps & IManagedClasses<IMediaClassNameContract>> = {
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLImageElement | HTMLPictureElement> {
        return (
             (this.props.src) ? this.generateSimpleImage() : this.generatePicture()
        );
    }

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

    private generateSrcSetString(): string {
        const imgSrcSet: any = this.props.mediaSrcSet.map((item: any , index: number) => {
            return item.srcSet;
        });

        return imgSrcSet.join(", ");
    }

    private generateMediaQuery(item: any): string {
        const maxWidth: string = (item.maxWidth != null) ? `(max-width: ${item.maxWidth})` : "";
        const and: string = (item.maxWidth != null && item.minWidth != null) ? ` and ` : "";
        const minWidth: string = (item.minWidth != null) ? `(min-width: ${item.minWidth})` : "";

        return minWidth + and + maxWidth;
    }

    private generatePicture(): React.ReactElement<HTMLPictureElement> {
        const sources: any = this.props.mediaSrcSet.map((item: any , index: number) => {
            return (
                <source key={index} srcSet={item.srcSet} media={this.generateMediaQuery(item)}/>
            );
        });

        return (
        <picture
            className={this.generateClassNames()}
        >
            {sources}
            <img
                className={this.generateRoundClass(this.props.managedClasses.image)}
                srcSet={this.props.mediaSrcSet[0].srcSet}
                src={this.props.mediaSrcSet[0].srcSet}
                alt={this.props.alt}
            />
        </picture>
        );
    }

    private generateSimpleImage(): React.ReactElement<HTMLImageElement> {
        return (
            <img
                className={this.generateClassNames()}
                src={this.props.src}
                srcSet={this.generateSrcSetString()}
                alt={this.props.alt}
                sizes={this.props.sizes}
            />
        );
    }
}

export default Media;
export * from "./media.props";
export {IMediaClassNameContract};
