import { CSSProperties, CSSPropertiesConfig } from "./property-editor.props";

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
                    monospaceFontWidthMultiplier *
                    filterPropertyKeyToDashSeparated(dataKey).length,
                valueWidth: monospaceFontWidthMultiplier * data[dataKey].length,
            };
        }
    );

    return dataConfig;
}

export function filterPropertyKeyToDashSeparated(key: string): string {
    return key.replace(/([A-Z])/g, function(match: string, group1: string): string {
        return `-${group1.toLowerCase()}`;
    });
}

export function filterPropertyKeyToCamelCase(key: string): string {
    return key.replace(/-(.)/g, function(match: string, group1: string): string {
        return group1.toUpperCase();
    });
}
