import * as React from "react";
import { Foundation, HandledProps } from "@microsoft/fast-components-react-base";
import Button from "../button/index";
import { ButtonAppearance, IMSFTButtonClassNameContract } from "../button/button";
import { CallToActionAppearance, ICallToActionHandledProps } from "./call-to-action.props";
import { ICallToActionClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";
import { get } from "lodash-es";
import { glyphArrowright } from "@microsoft/fast-glyphs-msft";
import { applyLocalizedProperty, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { IDesignSystem, withDesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { Direction } from "@microsoft/fast-application-utilities";

// Since MSFT button is already styled, we need to override in this way to alter button classes
const styles: ComponentStyles<Partial<IMSFTButtonClassNameContract>, IDesignSystem> = {
    button: {
        maxWidth: "100%",
        padding: (config: IDesignSystem): string => {
            const designSystem: IDesignSystem = withDesignSystemDefaults(config);
            return localizeSpacing(designSystem.direction)("13px 22px 11px 24px");
        }
    },
    button_span: {
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
        [applyLocalizedProperty("left", "right", Direction.ltr)]: "0"
    },
    button_primary: {
        "&:hover": {
            "& $button_span": {
                [applyLocalizedProperty("left", "right", Direction.ltr)]: "-4px"
            }
        }
    }
};

// tslint:disable-next-line:max-line-length
class CallToAction extends Foundation<ICallToActionHandledProps & IManagedClasses<ICallToActionClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    public static defaultProps: Partial<ICallToActionHandledProps  & IManagedClasses<ICallToActionClassNameContract>> = {
        appearance: CallToActionAppearance.primary
    };

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
                jssStyleSheet={styles}
            >
                {this.props.children}
                <div
                    slot="after"
                    className={get(this.props, "managedClasses.glyph")}
                    dangerouslySetInnerHTML={{__html: glyphArrowright}}
                />
            </Button>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = super.generateClassNames(get(this.props, "managedClasses.callToAction"));

        if (this.props.disabled) {
            classNames += `${classNames} ${get(this.props, "managedClasses.button__disabled")}`;
        }

        switch (this.props.appearance) {
            case CallToActionAppearance.primary:
                classNames = `${classNames} ${get(this.props, "managedClasses.callToAction_primary")}`;
                break;
            case CallToActionAppearance.lightweight:
                classNames = `${classNames} ${get(this.props, "managedClasses.callToAction_lightweight")}`;
                break;
            case CallToActionAppearance.justified:
                classNames = `${classNames} ${get(this.props, "managedClasses.callToAction_justified")}`;
                break;
        }

        return classNames;
    }
}

export default CallToAction;
export * from "./call-to-action.props";
export { ICallToActionClassNameContract };
