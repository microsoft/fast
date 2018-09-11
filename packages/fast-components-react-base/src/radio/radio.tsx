import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IRadioHandledProps, IRadioManagedClasses, IRadioUnhandledProps, RadioHTMLTags, RadioProps } from "./radio.props";
import { IManagedClasses, IRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get, isUndefined } from "lodash-es";

class Radio extends Foundation<IRadioHandledProps & IRadioManagedClasses, IRadioUnhandledProps, {}> {
    public render(): React.ReactElement<HTMLElement> {
        return (
            <div>
                Hello Radio!!!
            </div>
        );
    }
}

export default Radio;
export * from "./radio.props";
export {IRadioClassNameContract};
