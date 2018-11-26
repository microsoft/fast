import * as React from "react";
import { omit } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { CSSEditorHandledProps, CSSEditorUnhandledProps } from "./editor.props";
import { CSSPosition, CSSPositionValues, Location } from "./position";
import { CSSSpacing, CSSSpacingValues, SpacingKey } from "./spacing";

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
        spacingType: void 0,
        marginBottom: void 0,
        marginTop: void 0,
        marginLeft: void 0,
        marginRight: void 0,
        paddingBottom: void 0,
        paddingTop: void 0,
        paddingLeft: void 0,
        paddingRight: void 0,
        onSpacingUpdate: void 0,
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
            <React.Fragment>
                <CSSSpacing
                    jssStyleSheet={{ cssSpacing: { marginBottom: "10px" } }}
                    spacingType={this.props.spacingType}
                    marginBottom={this.props.marginBottom}
                    marginTop={this.props.marginTop}
                    marginLeft={this.props.marginLeft}
                    marginRight={this.props.marginRight}
                    paddingBottom={this.props.paddingBottom}
                    paddingTop={this.props.paddingTop}
                    paddingLeft={this.props.paddingLeft}
                    paddingRight={this.props.paddingRight}
                    onSpacingUpdate={this.handleSpacingUpdate}
                />
                <CSSPosition
                    position={this.props.position}
                    top={this.props.top}
                    bottom={this.props.bottom}
                    left={this.props.left}
                    right={this.props.right}
                    onPositionUpdate={this.handlePositionUpdate}
                />
            </React.Fragment>
        );
    }

    private getOmittedProps(): string[] {
        return ["managedClasses", "onChange", "onPositionUpdate", "spacingType"];
    }

    private handlePositionUpdate = (position: CSSPositionValues): void => {
        this.props.onChange(
            Object.assign(
                {},
                omit(this.props, [
                    ...this.getOmittedProps(),
                    Location.top,
                    Location.left,
                    Location.bottom,
                    Location.right,
                ]),
                position
            )
        );
    };

    private handleSpacingUpdate = (spacing: CSSSpacingValues): void => {
        this.props.onChange(
            Object.assign(
                {},
                omit(this.props, [
                    ...this.getOmittedProps(),
                    SpacingKey.marginBottom,
                    SpacingKey.marginTop,
                    SpacingKey.marginLeft,
                    SpacingKey.marginRight,
                    SpacingKey.paddingBottom,
                    SpacingKey.paddingTop,
                    SpacingKey.paddingLeft,
                    SpacingKey.paddingRight,
                ]),
                spacing
            )
        );
    };
}
