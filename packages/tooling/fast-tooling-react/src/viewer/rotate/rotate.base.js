import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { Orientation } from "./rotate.props";
export class Rotate extends Foundation {
    constructor() {
        super(...arguments);
        this.handledProps = {
            onUpdateOrientation: void 0,
            landscapeDisabled: void 0,
            portraitDisabled: void 0,
            orientation: void 0,
        };
        this.handleOrientationUpdate = orientation => {
            this.props.onUpdateOrientation(orientation);
        };
        this.handleLandscapeClick = () => {
            this.handleOrientationUpdate(Orientation.landscape);
        };
        this.handlePortraitClick = () => {
            this.handleOrientationUpdate(Orientation.portrait);
        };
    }
    render() {
        return (
            <div className={this.props.managedClasses.rotate}>
                <div className={this.props.managedClasses.rotate_controlInputContainer}>
                    <span>
                        <input
                            type="radio"
                            aria-label={this.props.landscapeLabel || "landscape view"}
                            className={this.getInputClassName(Orientation.landscape)}
                            disabled={this.props.landscapeDisabled}
                            onChange={this.handleLandscapeClick}
                            checked={this.props.orientation === Orientation.landscape}
                            tabIndex={
                                this.props.orientation !== Orientation.landscape
                                    ? -1
                                    : undefined
                            }
                        />
                    </span>
                    <span>
                        <input
                            type="radio"
                            aria-label={this.props.portraitLabel || "portrait view"}
                            className={this.getInputClassName(Orientation.portrait)}
                            disabled={this.props.portraitDisabled}
                            onChange={this.handlePortraitClick}
                            checked={this.props.orientation === Orientation.portrait}
                            tabIndex={
                                this.props.orientation !== Orientation.portrait
                                    ? -1
                                    : undefined
                            }
                        />
                    </span>
                </div>
            </div>
        );
    }
    getInputClassName(orientation) {
        let classes = get(this.props.managedClasses, "rotate_controlInput") || "";
        switch (orientation) {
            case Orientation.landscape:
                classes = classes.concat(
                    " ",
                    get(this.props.managedClasses, "rotate_controlInput__landscape"),
                    this.props.landscapeDisabled
                        ? ` ${get(
                              this.props.managedClasses,
                              "rotate_controlInput__disabled"
                          )}`
                        : ""
                );
                break;
            case Orientation.portrait:
                classes = classes.concat(
                    " ",
                    get(this.props.managedClasses, "rotate_controlInput__portrait"),
                    this.props.portraitDisabled
                        ? ` ${get(
                              this.props.managedClasses,
                              "rotate_controlInput__disabled"
                          )}`
                        : ""
                );
                break;
        }
        return classes;
    }
}
Rotate.displayName = "Rotate";
