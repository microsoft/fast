import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import { isEqual } from "lodash-es";
import { DesignSystemDefaults, isDarkMode } from "@microsoft/fast-components-styles-msft";

const styles: any = {
    gradient: {
        display: "flex",
        width: "100%",
    },
    gradient_item: {
        display: "flex",
        flex: "1",
        height: "100%",
    },
    gradient_item__marked: {
        position: "relative",
        "&::before": {
            width: "6px",
            height: "6px",
            margin: "0 auto",
            content: "''",
            opacity: "0.7",
            position: "relative",
            border: "solid 1px currentcolor",
            borderRadius: "50%",
            display: "block",
            alignSelf: "center",
        },
    },
};

interface GradientProps {
    managedClasses: any;
    colors: string[];
    markedColor?: string;
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
            let classNames: string = this.props.managedClasses.gradient_item;

            if (
                this.props.markedColor !== undefined &&
                item.toUpperCase() === this.props.markedColor.toUpperCase()
            ) {
                classNames = `${classNames} ${this.props.managedClasses.gradient_item__marked}`;
            }

            return (
                <a
                    key={index}
                    className={classNames}
                    style={{
                        background: this.props.colors[index],
                        color: isDarkMode(
                            Object.assign({}, DesignSystemDefaults, {
                                backgroundColor: this.props.colors[index],
                            })
                        )
                            ? "white"
                            : "black",
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
