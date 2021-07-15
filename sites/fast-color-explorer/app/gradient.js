import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import { isEqual } from "lodash-es";
import { isDark, SwatchRGB } from "@microsoft/fast-components";
import { parseColor } from "@microsoft/fast-colors";
const styles = {
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
class BaseGradient extends React.Component {
    render() {
        return (
            <div className={this.props.managedClasses.gradient}>{this.createItems()}</div>
        );
    }
    shouldComponentUpdate(props) {
        return !isEqual(props, this.props);
    }
    createItems() {
        return this.props.colors.map((item, index) => {
            let classNames = this.props.managedClasses.gradient_item;
            const bg = parseColor(this.props.colors[index]);
            const darkMode = isDark(SwatchRGB.create(bg.r, bg.g, bg.b));
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
                        color: darkMode ? "white" : "black",
                    }}
                    title={index.toString().concat(": ", item.toUpperCase())}
                    href={this.props.createAnchors ? `${item.toUpperCase()}` : undefined}
                    onClick={this.scrollToItem(index)}
                />
            );
        });
    }
    scrollToItem(index) {
        return e => {
            if (typeof this.props.scrollToItem === "function") {
                this.props.scrollToItem(index, "center");
            }
        };
    }
}
BaseGradient.displayName = "BaseGradient";
const Gradient = manageJss(styles)(BaseGradient);
export { Gradient };
