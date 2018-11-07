import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Orientation, RotateHandledProps, RotateUnhandledProps } from "./rotate.props";

class Rotate extends Foundation<RotateHandledProps, RotateUnhandledProps, {}> {
    public static displayName: string = "Rotate";

    protected handledProps: HandledProps<RotateHandledProps> = {
        onUpdateOrientation: void 0,
        landscapeDisabled: void 0,
        portraitDisabled: void 0,
        orientation: void 0,
    };

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.rotate}>
                <input
                    type="radio"
                    aria-label={this.props.landscapeLabel || "landscape view"}
                    className={this.props.managedClasses.rotate_input}
                    disabled={this.props.landscapeDisabled}
                    onChange={this.handleLandscapeClick}
                    checked={this.props.orientation === Orientation.landscape}
                    tabIndex={
                        this.props.orientation !== Orientation.landscape ? -1 : undefined
                    }
                />
                <span
                    className={this.getStateIndicatorClassNames(Orientation.landscape)}
                    onClick={this.handleLandscapeClick}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 50 50"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>{this.props.landscapeLabel || "landscape view"}</title>
                        <g>
                            <path d="M50 43.75V3.125H0V43.75H50ZM46.875 40.625H3.125V6.25H46.875V40.625ZM15.625 34.375H6.25V37.5H15.625V34.375ZM43.75 34.375H34.375V37.5H43.75V34.375Z" />
                        </g>
                    </svg>
                </span>
                <input
                    type="radio"
                    aria-label={this.props.portraitLabel || "portrait view"}
                    className={this.props.managedClasses.rotate_input}
                    disabled={this.props.portraitDisabled}
                    onChange={this.handlePortraitClick}
                    checked={this.props.orientation === Orientation.portrait}
                    tabIndex={
                        this.props.orientation !== Orientation.portrait ? -1 : undefined
                    }
                />
                <span
                    className={this.getStateIndicatorClassNames(Orientation.portrait)}
                    onClick={this.handlePortraitClick}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 50 50"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>{this.props.portraitLabel || "portrait view"}</title>
                        <g>
                            <path d="M43.75 50V0H3.125V50H43.75ZM40.625 46.875H6.25V3.125H40.625V46.875ZM18.75 40.625H9.375V43.75H18.75V40.625ZM37.5 40.625H28.125V43.75H37.5V40.625Z" />
                        </g>
                    </svg>
                </span>
            </div>
        );
    }

    private getStateIndicatorClassNames(orientation: Orientation): string {
        let classes: string = this.props.managedClasses.rotate_stateIndicator;

        if (orientation === Orientation.landscape) {
            classes += ` ${this.props.managedClasses.rotate_stateIndicator__landscape}${
                this.props.landscapeDisabled
                    ? ` ${this.props.managedClasses.rotate_stateIndicator__disabled}`
                    : ""
            }`;
        } else if (orientation === Orientation.portrait) {
            classes += ` ${this.props.managedClasses.rotate_stateIndicator__portrait}${
                this.props.portraitDisabled
                    ? ` ${this.props.managedClasses.rotate_stateIndicator__disabled}`
                    : ""
            }`;
        }

        return classes;
    }

    private handleOrientationUpdate = (orientation: Orientation): void => {
        this.props.onUpdateOrientation(orientation);
    };

    private handleLandscapeClick = (): void => {
        this.handleOrientationUpdate(Orientation.landscape);
    };

    private handlePortraitClick = (): void => {
        this.handleOrientationUpdate(Orientation.portrait);
    };
}

export default Rotate;
