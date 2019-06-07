import { CSSProperties, CSSPropertiesConfig } from "./property-editor.props";
import { spinalCase } from "@microsoft/fast-web-utilities";

const monospaceFontWidthMultiplier: number = 6.6;

export function getCSSPropertyConfig(data: CSSProperties): CSSPropertiesConfig {
    const dataConfig: CSSPropertiesConfig = {};

    if (!data) {
        return dataConfig;
    }

    Object.keys(data).map(
        (dataKey: string): void => {
            dataConfig[dataKey] = {
                value: data[dataKey],
                keyWidth:
                    typeof spinalCase(dataKey) === "string"
                        ? monospaceFontWidthMultiplier * spinalCase(dataKey).length
                        : 0,
                valueWidth:
                    typeof data[dataKey] === "string"
                        ? monospaceFontWidthMultiplier * data[dataKey].length
                        : 0,
            };
        }
    );

    return dataConfig;
}
