import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem } from "@microsoft/fast-components-styles-msft";

export interface IColorConfig {
    foregroundColor: string;
    backgroundColor: string;
    accentColor: string;
}

export interface IColorPickerProps extends IColorConfig {
    onColorUpdate: (colors: IColorConfig) => void;
}

export interface IColorPickerManagedClasses {
    colorPicker: string;
    colorPicker_label: string;
}

const styles: ComponentStyles<IColorPickerManagedClasses, IDesignSystem> = {
    colorPicker: {
        display: "flex",
        height: "100%",
        alignItems: "center"
    },
    colorPicker_label: {
        margin: "0 12px"
    }
};

class ColorPicker extends React.Component<IColorPickerProps & IManagedClasses<IColorPickerManagedClasses>, undefined> {
    /**
     * Ref object for foreground color input
     */
    private foregroundRef: React.RefObject<HTMLInputElement>;

    /**
     * Ref object for background color input
     */
    private backgroundRef: React.RefObject<HTMLInputElement>;

    /**
     * Ref object for accent color input
     */
    private accentRef: React.RefObject<HTMLInputElement>;

    constructor(props: IColorPickerProps) {
        super(props);

        this.foregroundRef = React.createRef();
        this.backgroundRef = React.createRef();
        this.accentRef = React.createRef();
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.colorPicker}>
                {this.createColorInput("foreground", this.props.foregroundColor, "foregroundInput", this.foregroundRef)}
                {this.createColorInput("background", this.props.backgroundColor, "backgroundInput", this.backgroundRef)}
                {this.createColorInput("accent", this.props.accentColor, "accentInput", this.accentRef)}
            </div>
        );
    }

    /**
     * Creates individual label/input elements
     */
    private createColorInput(name: string, value: string, id: string, ref: React.RefObject<HTMLInputElement>): JSX.Element {
        return (
            <React.Fragment>
                <label
                    htmlFor={id}
                    className={this.props.managedClasses.colorPicker_label}
                >
                    {name}
                </label>
                <input
                    type="color"
                    value={this.formatColor(value)}
                    id={id}
                    name={name}
                    onChange={this.handleColorPickerChange}
                    ref={ref}
                />
            </React.Fragment>
        );
    }

    /**
     * Event handler for all color input changes
     */
    private handleColorPickerChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const value: string = e.currentTarget.value;
        const updatedColorKey: keyof IColorConfig = e.currentTarget === this.foregroundRef.current
            ? "foregroundColor"
            : e.currentTarget === this.backgroundRef.current
            ? "backgroundColor"
            : "accentColor";

        if (typeof this.props.onColorUpdate === "function") {
            this.props.onColorUpdate(Object.assign({}, this.props, { [updatedColorKey]: value}));
        }
    }

    /**
     * Ensures that colors are properly formatted
     * Color input elements don't understand three digit hex values, so we need to convert them to 6
     */
    private formatColor(color: string): string {
        const threeDigitHex: RegExp = /\#([a-fA-F0-9]{3})$/g;
        const match: string[] | null = threeDigitHex.exec(color);

        return Array.isArray(match)
            ? `#${match[1].split("").map((character: string) => character + character).join("")}`
            : color;
    }
}

export default manageJss(styles)(ColorPicker);
