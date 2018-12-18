import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    AutoSuggestHandledProps,
    AutoSuggestManagedClasses,
    AutoSuggestProps,
    AutoSuggestUnhandledProps,
} from "./auto-suggest.props";
import {
    AutoSuggest as BaseAutoSuggest,
    AutoSuggestState,
} from "@microsoft/fast-components-react-base";
import { TextAction } from "../text-action";

class AutoSuggest extends Foundation<
    AutoSuggestHandledProps,
    AutoSuggestUnhandledProps,
    {}
> {
    public static displayName: string = "AutoSuggest";

    protected handledProps: HandledProps<AutoSuggestHandledProps> = {
        listboxId: void 0,
        disabled: void 0,
        inputRegion: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <BaseAutoSuggest
                {...this.unhandledProps()}
                listboxId={this.props.listboxId}
                managedClasses={this.props.managedClasses}
                disabled={this.props.disabled}
                inputRegion={
                    typeof this.props.inputRegion === "function"
                        ? this.props.inputRegion
                        : this.defaultInputRegionRenderFunction
                }
            >
                {this.props.children}
            </BaseAutoSuggest>
        );
    }

    /**
     * The default function that renders an unstyled content display
     */
    private defaultInputRegionRenderFunction = (
        props: AutoSuggestProps,
        state: AutoSuggestState,
        onChange: (event: React.ChangeEvent) => void,
        onClick: (event: React.MouseEvent) => void,
        onKeyDown: (event: React.KeyboardEvent) => void
    ): React.ReactNode => {
        const listboxId: string = state.isMenuOpen ? props.listboxId : null;
        const activedescendantId: string =
            state.focusedItem !== null ? state.focusedItem.id : null;
        return (
            <TextAction
                disabled={props.disabled}
                onChange={onChange}
                onClick={onClick}
                onKeyDown={onKeyDown}
                value={state.value}
                placeholder={props.placeholder}
                beforeGlyph={this.generateGlyph}
                role="combobox"
                aria-label={props.label || null}
                aria-autocomplete="both"
                aria-activedescendant={activedescendantId || null}
                aria-owns={listboxId || null}
                aria-controls={listboxId || null}
            />
        );
    };

    /**
     * Gets the search glyph
     * TODO: scomea - replace with ref to a glyph resource (https://github.com/Microsoft/fast-dna/issues/1488)
     */
    private generateGlyph = (className: string): React.ReactNode => {
        return (
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M10.5 0C11.0052 0 11.4922 0.0651042 11.9609 0.195312C12.4297 0.325521 12.8672 0.510417 13.2734 0.75C13.6797 0.989583 14.0495 1.27865 14.3828 1.61719C14.7214 1.95052 15.0104 2.32031 15.25 2.72656C15.4896 3.13281 15.6745 3.57031 15.8047 4.03906C15.9349 4.50781 16 4.99479 16 5.5C16 6.00521 15.9349 6.49219 15.8047 6.96094C15.6745 7.42969 15.4896 7.86719 15.25 8.27344C15.0104 8.67969 14.7214 9.05208 14.3828 9.39062C14.0495 9.72396 13.6797 10.0104 13.2734 10.25C12.8672 10.4896 12.4297 10.6745 11.9609 10.8047C11.4922 10.9349 11.0052 11 10.5 11C9.84896 11 9.22396 10.8906 8.625 10.6719C8.03125 10.4531 7.48438 10.138 6.98438 9.72656L0.851562 15.8516C0.752604 15.9505 0.635417 16 0.5 16C0.364583 16 0.247396 15.9505 0.148438 15.8516C0.0494792 15.7526 0 15.6354 0 15.5C0 15.3646 0.0494792 15.2474 0.148438 15.1484L6.27344 9.01562C5.86198 8.51562 5.54688 7.96875 5.32812 7.375C5.10938 6.77604 5 6.15104 5 5.5C5 4.99479 5.0651 4.50781 5.19531 4.03906C5.32552 3.57031 5.51042 3.13281 5.75 2.72656C5.98958 2.32031 6.27604 1.95052 6.60938 1.61719C6.94792 1.27865 7.32031 0.989583 7.72656 0.75C8.13281 0.510417 8.57031 0.325521 9.03906 0.195312C9.50781 0.0651042 9.99479 0 10.5 0ZM10.5 10C11.1198 10 11.7031 9.88281 12.25 9.64844C12.7969 9.40885 13.2734 9.08594 13.6797 8.67969C14.0859 8.27344 14.4062 7.79688 14.6406 7.25C14.8802 6.70312 15 6.11979 15 5.5C15 4.88021 14.8802 4.29688 14.6406 3.75C14.4062 3.20312 14.0859 2.72656 13.6797 2.32031C13.2734 1.91406 12.7969 1.59375 12.25 1.35938C11.7031 1.11979 11.1198 1 10.5 1C9.88021 1 9.29688 1.11979 8.75 1.35938C8.20312 1.59375 7.72656 1.91406 7.32031 2.32031C6.91406 2.72656 6.59115 3.20312 6.35156 3.75C6.11719 4.29688 6 4.88021 6 5.5C6 6.11979 6.11719 6.70312 6.35156 7.25C6.59115 7.79688 6.91406 8.27344 7.32031 8.67969C7.72656 9.08594 8.20312 9.40885 8.75 9.64844C9.29688 9.88281 9.88021 10 10.5 10Z" />
            </svg>
        );
    };
}

export default AutoSuggest;
export * from "./auto-suggest.props";
