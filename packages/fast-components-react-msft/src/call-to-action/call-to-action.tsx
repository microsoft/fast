import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button, ButtonAppearance } from "../button";
import {
    CallToActionAppearance,
    CallToActionHandledProps,
    CallToActionUnhandledProps,
} from "./call-to-action.props";
import { get } from "lodash-es";
import { glyphArrowright } from "@microsoft/fast-glyphs-msft";
import { callToActionButtonOverrides } from "@microsoft/fast-components-styles-msft";

class CallToAction extends Foundation<
    CallToActionHandledProps,
    CallToActionUnhandledProps,
    {}
> {
    public static displayName: string = "CallToAction";

    protected handledProps: HandledProps<CallToActionHandledProps> = {
        appearance: void 0,
        href: void 0,
        managedClasses: void 0,
        disabled: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <Button
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                disabled={this.props.disabled}
                href={this.props.disabled ? null : this.props.href}
                appearance={
                    ButtonAppearance[CallToActionAppearance[this.props.appearance]]
                }
                jssStyleSheet={callToActionButtonOverrides}
                afterContent={this.renderAfterContent()}
            >
                {this.props.children}
            </Button>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.callToAction", "");

        if (this.props.disabled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.callToAction__disabled",
                ""
            )}`;
        }

        switch (this.props.appearance) {
            case CallToActionAppearance.primary:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.callToAction__primary",
                    ""
                )}`;
                break;
            case CallToActionAppearance.lightweight:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.callToAction__lightweight",
                    ""
                )}`;
                break;
            case CallToActionAppearance.justified:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.callToAction__justified",
                    ""
                )}`;
                break;
        }

        return super.generateClassNames(classNames);
    }

    private renderAfterContent(): (classname?: string) => React.ReactNode {
        return (): React.ReactNode => {
            return (
                <span
                    className={get(this.props, "managedClasses.callToAction_glyph")}
                    dangerouslySetInnerHTML={{ __html: glyphArrowright }}
                />
            );
        };
    }
}

export default CallToAction;
export * from "./call-to-action.props";
