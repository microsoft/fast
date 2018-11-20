import * as React from "react";
import { omit } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { CSSEditorHandledProps, CSSEditorUnhandledProps } from "./editor.props";
import { CSSPosition, CSSPositionValues, Location } from "./position";

export default class CSSEditor extends Foundation<
    CSSEditorHandledProps,
    CSSEditorUnhandledProps,
    {}
> {
    public static displayName: string = "CSSEditor";

    protected handledProps: HandledProps<CSSEditorHandledProps> = {
        position: void 0,
        top: void 0,
        bottom: void 0,
        left: void 0,
        right: void 0,
        onPositionUpdate: void 0,
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
                onPositionUpdate={this.handlePositionUpdate}
            />
        );
    }

    private handlePositionUpdate = (position: CSSPositionValues): void => {
        this.props.onChange(
            Object.assign(
                {},
                omit(this.props, [
                    "managedClasses",
                    "onChange",
                    "onPositionUpdate",
                    "position",
                    Location.top,
                    Location.left,
                    Location.bottom,
                    Location.right,
                ]),
                position
            )
        );
    };
}
