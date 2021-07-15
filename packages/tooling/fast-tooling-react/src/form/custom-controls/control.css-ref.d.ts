import React from "react";
import { CSSRefProps, CSSRefState } from "./control.css-ref.props";
/**
 * Custom CSS reference definition
 */
export declare class CSSRef extends React.Component<CSSRefProps, CSSRefState> {
    constructor(props: CSSRefProps);
    render(): React.ReactNode;
    private renderMultipleItems;
    private renderExactlyOne;
    private renderByType;
    private renderBrackets;
    private handleFormElementOnChange;
    private handleChange;
    private handleMultipleChange;
}
