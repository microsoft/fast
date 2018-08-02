import * as React from "react";

export interface IColorConfig {
    foregroundColor: string;
    backgroundColor: string;
    accentColor: string;
}


export interface IColorPickerProps extends IColorConfig {
    onColorUpdate: (colors: IColorConfig) => void;
}

export default class ColorPicker extends React.Component<IColorPickerProps, undefined> {
    constructor(props: IColorPickerProps) {
        super(props);

        this.foregroundRef = React.createRef();
        this.backgroundRef = React.createRef();
        this.accentRef = React.createRef();
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                { this.createColorInput("foreground", this.props.foregroundColor, "foregroundInput", this.foregroundRef) }
                { this.createColorInput("background", this.props.backgroundColor, "backgroundInput", this.backgroundRef)}
                { this.createColorInput("accent", this.props.accentColor, "accentInput", this.accentRef)}
            </React.Fragment>
        );
    }

    private createColorInput(name: string, value: string, id: string, ref: React.RefObject<HTMLInputElement>) {
        return (
            <React.Fragment>
                <label for={id}>{name}</label>
                <input type="color" value={value} id={id} name={name} onChange={this.handleColorPickerChange} ref={ref}/>
            </React.Fragment>
        )
    }

    private foregroundRef: React.RefObject<HTMLInputElement>;
    private backgroundRef: React.RefObject<HTMLInputElement>;
    private accentRef: React.RefObject<HTMLInputElement>;

    /**
     * Event handler for all color input changes
     */
    private handleColorPickerChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const updatedColorKey: keyof IColorConfig = e.currentTarget === this.foregroundRef.current
            ? "foregroundColor"
            : e.currentTarget === this.backgroundRef.current
            ? "backgroundColor"
            : "accentColor";

        if (typeof this.props.onColorUpdate === "function") {
            this.props.onColorUpdate(Object.assign({}, this.props, { [updatedColorKey]: value}));
        }
    }
}
