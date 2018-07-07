import * as React from "react";
import { omit } from "lodash-es";
import CSSPosition, { ICSSPositionProps, Location } from "./position";

/*tslint:disable-next-line*/
export interface ICSSEditorProps extends ICSSPositionProps {}

class CSSEditor extends React.Component<ICSSEditorProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                {this.renderPosition()}
            </div>
        );
    }

    private renderPosition(): JSX.Element {
        return (
            <CSSPosition
                position={this.props.position}
                top={this.props.top}
                bottom={this.props.bottom}
                left={this.props.left}
                right={this.props.right}
                onChange={this.handlePositionUpdate}
            />
        );
    }

    private handlePositionUpdate = (position: Partial<ICSSEditorProps>): void => {
        this.props.onChange(
            Object.assign(
                {},
                omit(this.props, ["position", "onChange", Location.top, Location.bottom, Location.left, Location.right]),
                { ...position }
            )
        );
    }
}

export default CSSEditor;
export { CSSPosition };
export * from "./position";
