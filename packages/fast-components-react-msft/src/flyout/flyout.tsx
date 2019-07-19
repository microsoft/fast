import React from "react";
import ReactDOM from "react-dom";
import { get, isNil } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    AxisPositioningMode,
    ViewportPositioner,
    ViewportPositionerClassNameContract,
    ViewportPositionerHorizontalPosition,
    ViewportPositionerVerticalPosition,
} from "@microsoft/fast-components-react-base";
import {
    FlyoutAxisPositioningMode,
    FlyoutHandledProps,
    FlyoutHorizontalPosition,
    FlyoutManagedClasses,
    FlyoutProps,
    FlyoutUnhandledProps,
    FlyoutVerticalPosition,
} from "./flyout.props";
import {
    FlyoutClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { DisplayNamePrefix } from "../utilities";

class Flyout extends Foundation<FlyoutHandledProps, FlyoutUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Flyout`;

    public static defaultProps: Partial<FlyoutProps> = {
        visible: false,
        horizontalPositioningMode: FlyoutAxisPositioningMode.uncontrolled,
        defaultHorizontalPosition: FlyoutHorizontalPosition.uncontrolled,
        verticalPositioningMode: FlyoutAxisPositioningMode.adjacent,
        defaultVerticalPosition: FlyoutVerticalPosition.bottom,
        horizontalAlwaysInView: false,
        verticalAlwaysInView: false,
        fixedAfterInitialPlacement: false,
        height: "128px",
        width: "280px",
    };

    protected handledProps: HandledProps<Required<FlyoutHandledProps>> = {
        anchor: void 0,
        children: void 0,
        defaultHorizontalPosition: void 0,
        defaultVerticalPosition: void 0,
        describedBy: void 0,
        visible: void 0,
        fixedAfterInitialPlacement: void 0,
        height: void 0,
        horizontalAlwaysInView: void 0,
        horizontalLockToDefault: void 0,
        horizontalPositioningMode: void 0,
        horizontalThreshold: void 0,
        label: void 0,
        labelledBy: void 0,
        managedClasses: void 0,
        onDismiss: void 0,
        verticalAlwaysInView: void 0,
        verticalLockToDefault: void 0,
        verticalPositioningMode: void 0,
        verticalThreshold: void 0,
        viewport: void 0,
        width: void 0,
    };

    private rootEl: React.RefObject<ViewportPositioner>;

    constructor(props: FlyoutProps) {
        super(props);

        this.rootEl = React.createRef();
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <ViewportPositioner
                {...this.unhandledProps()}
                ref={this.rootEl}
                role="dialog"
                aria-label={this.props.label}
                aria-labelledby={this.props.labelledBy}
                aria-describedby={this.props.describedBy}
                aria-hidden={!this.props.visible}
                anchor={this.props.anchor}
                defaultHorizontalPosition={
                    ViewportPositionerHorizontalPosition[
                        FlyoutHorizontalPosition[this.props.defaultHorizontalPosition]
                    ]
                }
                defaultVerticalPosition={
                    ViewportPositionerVerticalPosition[
                        FlyoutVerticalPosition[this.props.defaultVerticalPosition]
                    ]
                }
                disabled={false}
                fixedAfterInitialPlacement={this.props.fixedAfterInitialPlacement}
                horizontalAlwaysInView={this.props.horizontalAlwaysInView}
                horizontalPositioningMode={
                    AxisPositioningMode[
                        FlyoutAxisPositioningMode[this.props.horizontalPositioningMode]
                    ]
                }
                horizontalThreshold={this.props.horizontalThreshold}
                managedClasses={this.generateManagedClassNames()}
                verticalAlwaysInView={this.props.verticalAlwaysInView}
                verticalPositioningMode={
                    AxisPositioningMode[
                        FlyoutAxisPositioningMode[this.props.verticalPositioningMode]
                    ]
                }
                verticalThreshold={this.props.verticalThreshold}
                viewport={this.props.viewport}
                style={{
                    height: this.props.height,
                    width: this.props.width,
                }}
            >
                {this.props.children}
            </ViewportPositioner>
        );
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        if (canUseDOM() && this.props.onDismiss) {
            window.addEventListener("keydown", this.handleWindowKeyDown);
            window.addEventListener("click", this.handleWindowClick);
        }
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(prevProps: Partial<FlyoutProps>): void {
        if (canUseDOM()) {
            if (!prevProps.onDismiss && this.props.onDismiss) {
                window.addEventListener("keydown", this.handleWindowKeyDown);
                window.addEventListener("click", this.handleWindowClick);
            } else if (prevProps.onDismiss && !this.props.onDismiss) {
                window.removeEventListener("keydown", this.handleWindowKeyDown);
                window.removeEventListener("click", this.handleWindowClick);
            }
        }
    }

    /**
     * React life-cycle method
     */
    public componentWillUnmount(): void {
        if (canUseDOM() && this.props.onDismiss) {
            window.removeEventListener("keydown", this.handleWindowKeyDown);
            window.removeEventListener("click", this.handleWindowClick);
        }
    }

    private generateManagedClassNames(): ViewportPositionerClassNameContract {
        return {
            viewportPositioner: get(this.props.managedClasses, "flyout", ""),
            viewportPositioner__left: get(this.props.managedClasses, "flyout__left", ""),
            viewportPositioner__right: get(
                this.props.managedClasses,
                "flyout__right",
                ""
            ),
            viewportPositioner__top: get(this.props.managedClasses, "flyout__top", ""),
            viewportPositioner__bottom: get(
                this.props.managedClasses,
                "flyout__bottom",
                ""
            ),
            viewportPositioner__horizontalInset: get(
                this.props.managedClasses,
                "flyout__horizontalInset",
                ""
            ),
            viewportPositioner__verticalInset: get(
                this.props.managedClasses,
                "flyout__verticalInset",
                ""
            ),
        };
    }

    private handleWindowClick = (event: MouseEvent): void => {
        const anchor: React.RefObject<any> | HTMLElement =
            this.props.anchor instanceof HTMLElement
                ? this.props.anchor
                : this.props.anchor.current;

        if (
            typeof this.props.onDismiss === "function" &&
            this.props.visible && // this fires when the prop changes to visible
            !ReactDOM.findDOMNode(this.rootEl.current).contains(event.target) &&
            !ReactDOM.findDOMNode(anchor).contains(event.target)
        ) {
            this.props.onDismiss(event);
        }
    };

    private handleWindowKeyDown = (event: KeyboardEvent): void => {
        if (
            typeof this.props.onDismiss === "function" &&
            this.props.visible &&
            event.keyCode === KeyCodes.escape
        ) {
            this.props.onDismiss(event);
        }
    };
}

export default Flyout;
export * from "./flyout.props";
export { FlyoutClassNameContract };
