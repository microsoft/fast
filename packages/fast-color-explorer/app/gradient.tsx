import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import { ColorsDesignSystem } from "./design-system";
import { isEqual } from "lodash-es";

const styles: any = (designSystem: ColorsDesignSystem): any => {
    return {
        gradient: {
            display: "flex",
            width: "100%",
        },
        gradient_item: {
            display: "block",
            flex: "1",
            height: "40px",
        },
    };
};

interface GradientProps {
    managedClasses: any;
    colors: string[];
    createAnchors?: boolean;
    scrollToItem?: (index: number, align: string) => void;
}

class BaseGradient extends React.Component<GradientProps, {}> {
    public static displayName: string = "BaseGradient";
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.gradient}>{this.createItems()}</div>
        );
    }

    public shouldComponentUpdate(props: GradientProps): boolean {
        return !isEqual(props, this.props);
    }

    private createItems(): React.ReactNode {
        return this.props.colors.map((item: string, index: number) => {
            return (
                <a
                    key={index}
                    className={this.props.managedClasses.gradient_item}
                    style={{
                        background: this.props.colors[index],
                    }}
                    title={index.toString().concat(": ", item.toUpperCase())}
                    href={this.props.createAnchors ? `${item.toUpperCase()}` : undefined}
                    onClick={this.scrollToItem(index)}
                />
            );
        });
    }

    private scrollToItem(
        index: number
    ): (e: React.MouseEvent<HTMLAnchorElement>) => void {
        return (e: React.MouseEvent<HTMLAnchorElement>): void => {
            if (typeof this.props.scrollToItem === "function") {
                this.props.scrollToItem(index, "center");
            }
        };
    }
}

const Gradient: any = manageJss(styles)(BaseGradient);

export { Gradient };
