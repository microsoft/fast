import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button } from "../button/index";
import { ButtonAppearance, IMSFTButtonClassNameContract } from "../button/button";
import { CallToActionAppearance, ICallToActionHandledProps } from "./call-to-action.props";
import { ICallToActionClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";
import { get } from "lodash-es";
import { glyphArrowright } from "@microsoft/fast-glyphs-msft";
import { callToActionButtonOverrides } from "@microsoft/fast-components-styles-msft";

class CallToAction extends Foundation<
    ICallToActionHandledProps & IManagedClasses<ICallToActionClassNameContract>,
    React.AllHTMLAttributes<HTMLElement>,
    {}
> {
    public static displayName: string = "CallToAction";

    protected handledProps: HandledProps<ICallToActionHandledProps & IManagedClasses<ICallToActionClassNameContract>> = {
        appearance: void 0,
        href: void 0,
        managedClasses: void 0,
        disabled: void 0
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
                href={this.props.href}
                appearance={ButtonAppearance[CallToActionAppearance[this.props.appearance]]}
                jssStyleSheet={callToActionButtonOverrides}
            >
                {this.props.children}
                <div
                    slot="after"
                    className={get(this.props, "managedClasses.callToAction_glyph")}
                    dangerouslySetInnerHTML={{__html: glyphArrowright}}
                />
            </Button>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.callToAction");

        if (this.props.disabled) {
            classNames = `${classNames} ${get(this.props, "managedClasses.callToAction__disabled")}`;
        }

        switch (this.props.appearance) {
            case CallToActionAppearance.primary:
                classNames = `${classNames} ${get(this.props, "managedClasses.callToAction__primary")}`;
                break;
            case CallToActionAppearance.lightweight:
                classNames = `${classNames} ${get(this.props, "managedClasses.callToAction__lightweight")}`;
                break;
            case CallToActionAppearance.justified:
                classNames = `${classNames} ${get(this.props, "managedClasses.callToAction__justified")}`;
                break;
        }

        return super.generateClassNames(classNames);
    }
}

export default CallToAction;
export * from "./call-to-action.props";
export { ICallToActionClassNameContract };
