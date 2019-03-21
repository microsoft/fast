import { toPx } from "@microsoft/fast-jss-utilities";
import { Breakpoints } from "../utilities/breakpoints";
import { KeyOfToType } from "./keyof-to-type";
import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";
import { DensityCategory, getDensityCategory } from "./density";

/**
 * The type ramp item config
 */
export interface TypeRampItemConfig {
    fontSize: number;
    lineHeight: number;
}

/**
 * The type ramp item type
 */
export type TypeRampItem = TypeRampItemConfig;

/**
 * The type ramp which covers all type configurations used
 * in typographic elements
 */
export interface TypeRamp {
    t1: TypeRampItem;
    t2: TypeRampItem;
    t3: TypeRampItem;
    t4: TypeRampItem;
    t5: TypeRampItem;
    t6: TypeRampItem;
    t7: TypeRampItem;
    t8: TypeRampItem;
    t9: TypeRampItem;
}

/**
 * The type ramp configuration
 */
export const typeRamp: TypeRamp = {
    t1: {
        fontSize: 60,
        lineHeight: 72,
    },
    t2: {
        fontSize: 46,
        lineHeight: 56,
    },
    t3: {
        fontSize: 34,
        lineHeight: 44,
    },
    t4: {
        fontSize: 28,
        lineHeight: 36,
    },
    t5: {
        fontSize: 20,
        lineHeight: 28,
    },
    t6: {
        fontSize: 16,
        lineHeight: 24,
    },
    t7: {
        fontSize: 14,
        lineHeight: 20,
    },
    t8: {
        fontSize: 12,
        lineHeight: 16,
    },
    t9: {
        fontSize: 10,
        lineHeight: 16,
    },
};

/**
 * Applies a type ramp config instance based on viewport
 * @deprecated
 */
export function applyType(
    typeConfig: keyof TypeRamp,
    viewport?: keyof KeyOfToType<Breakpoints, TypeRampItemConfig>
): CSSRules<DesignSystem> {
    if (viewport) {
        /* tslint:disable-next-line:no-console */
        console.warn(
            "The applyType function has been deprecated. Please use applyTypeRampConfig instead"
        );
    }

    return {
        fontSize: toPx(typeRamp[typeConfig].fontSize),
        lineHeight: toPx(typeRamp[typeConfig].lineHeight),
    };
}

/**
 * Takes a param of type ramp key (string) and returns a type ramp configuration
 */
export function applyTypeRampConfig(typeConfig: keyof TypeRamp): CSSRules<DesignSystem> {
    return {
        fontSize: toPx(typeRamp[typeConfig].fontSize),
        lineHeight: toPx(typeRamp[typeConfig].lineHeight),
    };
}

/**
 * Adds the font size and line height attributes for the type ramp, scaled according to the design system density config.
 *
 * @param config The design system config.
 * @param typeConfig The default type ramp config at base density.
 */
export function scaleApplyTypeRampConfigWithDensity(
    config: DesignSystem,
    typeConfig: keyof TypeRamp
): CSSRules<DesignSystem> {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const category: DensityCategory = getDensityCategory(designSystem);
    const densityOffset: number =
        category === DensityCategory.compact
            ? -1
            : category === DensityCategory.spacious
                ? 1
                : 0;
    const typeConfigNumber: number = parseInt(typeConfig.replace("t", ""), 10);
    const size: number = typeConfigNumber - densityOffset;
    const key: keyof TypeRamp | string = "t" + size;

    if (key in typeRamp) {
        return applyTypeRampConfig(key as keyof TypeRamp);
    } else {
        return applyTypeRampConfig(typeConfig);
    }
}
