import * as React from "react";
import CSSPosition, { ICSSPositionProps } from "./position";

export interface ICSSEditorProps {
    position: ICSSPositionProps;
    onChange?: (cssValues: any) => void;
}

class CSSEditor extends React.Component<ICSSEditorProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                {this.renderPosition()}
            </div>
        );
    }

    private renderPosition(): JSX.Element {
        if (this.props.position) {
            return (
                <CSSPosition
                    {...this.props.position}
                    onChange={this.handlePositionChange}
                />
            );
        }
    }

    private handlePositionChange = (positionProps: ICSSPositionProps): void => {
        this.props.onChange(Object.assign({}, this.props, { position: positionProps }));
    }
}

export default CSSEditor;
export { CSSPosition };
export * from "./position";
