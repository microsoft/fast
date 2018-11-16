import * as React from "react";
import { omit } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { CSSEditorHandledProps, CSSEditorUnhandledProps } from "./editor.props";
import CSSPosition, { Location } from "./position";

class CSSEditor extends Foundation<CSSEditorHandledProps, CSSEditorUnhandledProps, {}> {
    public static displayName: string = "CSSEditor";

    protected handledProps: HandledProps<CSSEditorHandledProps> = {
        position: void 0,
        top: void 0,
        bottom: void 0,
        left: void 0,
        right: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <div className={this.props.managedClasses.cssEditor}>
                {this.renderPosition()}
            </div>
        );
    }

    private renderPosition(): React.ReactNode {
        return (
            <CSSPosition
                position={this.props.position}
                top={this.props.top}
                bottom={this.props.bottom}
                left={this.props.left}
                right={this.props.right}
                onChange={this.handlePositionUpdate}
            />
        );
    }

    private handlePositionUpdate = (position: Partial<CSSEditorHandledProps>): void => {
        this.props.onChange(
            Object.assign(
                {},
                omit(this.props, [
                    "position",
                    "onChange",
                    Location.top,
                    Location.bottom,
                    Location.left,
                    Location.right,
                ]),
                { ...position }
            )
        );
    };
}

export default CSSEditor;
export { CSSPosition };
export * from "./position";
