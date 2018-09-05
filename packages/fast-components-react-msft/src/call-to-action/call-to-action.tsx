import * as React from "react";
import { Foundation, HandledProps } from "@microsoft/fast-components-react-base";
import { Hypertext } from "@microsoft/fast-components-react-base";
import { CallToActionAppearance, ICallToActionHandledProps } from "./call-to-action.props";
import { ICallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

// tslint:disable-next-line:max-line-length
class CallToAction extends Foundation<ICallToActionHandledProps & IManagedClasses<ICallToActionClassNameContract>,  React.AllHTMLAttributes<HTMLAnchorElement>, {}> {
    public static defaultProps: Partial<ICallToActionHandledProps> = {
        appearance: CallToActionAppearance.primary
    };

    protected handledProps: HandledProps<ICallToActionHandledProps & IManagedClasses<ICallToActionClassNameContract>> = {
        appearance: void 0,
        href: void 0,
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <Hypertext
                {...this.unhandledProps()}
                managedClasses={this.props.managedClasses}
                href={this.props.href}
                className={this.generateClassNames()}
            >
                <span className={this.props.managedClasses.callToAction_span}>{this.props.children}</span>
            </Hypertext>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        switch (this.props.appearance) {
            case CallToActionAppearance.primary:
                return super.generateClassNames(get(this.props, "managedClasses.callToAction_primary"));
            case CallToActionAppearance.secondary:
                return super.generateClassNames(get(this.props, "managedClasses.callToAction_secondary"));
            case CallToActionAppearance.lightweight:
                return super.generateClassNames(get(this.props, "managedClasses.callToAction_lightweight"));
        }
    }
}

export default CallToAction;
export * from "./call-to-action.props";
export { ICallToActionClassNameContract };
