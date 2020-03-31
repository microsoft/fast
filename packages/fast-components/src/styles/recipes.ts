import {
    accentFill,
    accentFillLarge,
    accentForeground,
    accentForegroundCut,
    accentForegroundLarge,
    DesignSystem,
    neutralDividerRest,
    neutralFill,
    neutralFillCard,
    neutralFillInput,
    neutralFillStealth,
    neutralFillToggle,
    neutralFocus,
    neutralFocusInnerAccent,
    neutralForeground,
    neutralForegroundHint,
    neutralForegroundHintLarge,
    neutralForegroundToggle,
    neutralForegroundToggleLarge,
    neutralLayerCard,
    neutralLayerCardContainer,
    neutralLayerFloating,
    neutralLayerL1,
    neutralLayerL1Alt,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
    neutralOutline,
} from "@microsoft/fast-components-styles-msft";

export interface DesignSystemResolverEntry {
    name: string;
    resolver: (designSystem: DesignSystem) => string | number;
}
export const neutralforegroundrest: DesignSystemResolverEntry = {
    name: "neutral-foreground-rest",
    resolver: x => neutralForeground(x).rest,
};

export const neutralforegroundhover: DesignSystemResolverEntry = {
    name: "neutral-foreground-hover",
    resolver: x => neutralForeground(x).hover,
};

export const neutralforegroundactive: DesignSystemResolverEntry = {
    name: "neutral-foreground-active",
    resolver: x => neutralForeground(x).active,
};

export const neutralforegroundfocus: DesignSystemResolverEntry = {
    name: "neutral-foreground-focus",
    resolver: x => neutralForeground(x).focus,
};

export const neutralforegroundtoggle: DesignSystemResolverEntry = {
    name: "neutral-foreground-toggle",
    resolver: x => neutralForegroundToggle(x),
};

export const neutralforegroundtogglelarge: DesignSystemResolverEntry = {
    name: "neutral-foreground-toggle-large",
    resolver: x => neutralForegroundToggleLarge(x),
};

export const neutralforegroundhint: DesignSystemResolverEntry = {
    name: "neutral-foreground-hint",
    resolver: x => neutralForegroundHint(x),
};

export const neutralforegroundhintlarge: DesignSystemResolverEntry = {
    name: "neutral-foreground-hint-large",
    resolver: x => neutralForegroundHintLarge(x),
};

export const accentforegroundrest: DesignSystemResolverEntry = {
    name: "accent-foreground-rest",
    resolver: x => accentForeground(x).rest,
};

export const accentforegroundhover: DesignSystemResolverEntry = {
    name: "accent-foreground-hover",
    resolver: x => accentForeground(x).hover,
};

export const accentforegroundactive: DesignSystemResolverEntry = {
    name: "accent-foreground-active",
    resolver: x => accentForeground(x).active,
};

export const accentforegroundfocus: DesignSystemResolverEntry = {
    name: "accent-foreground-focus",
    resolver: x => accentForeground(x).focus,
};

export const accentforegroundcutrest: DesignSystemResolverEntry = {
    name: "accent-foreground-cut-rest",
    resolver: x => accentForegroundCut(x),
};

export const accentforegroundlargerest: DesignSystemResolverEntry = {
    name: "accent-foreground-large-rest",
    resolver: x => accentForegroundLarge(x).rest,
};

export const accentforegroundlargehover: DesignSystemResolverEntry = {
    name: "accent-foreground-large-hover",
    resolver: x => accentForegroundLarge(x).hover,
};

export const accentforegroundlargeactive: DesignSystemResolverEntry = {
    name: "accent-foreground-large-active",
    resolver: x => accentForegroundLarge(x).active,
};

export const accentforegroundlargefocus: DesignSystemResolverEntry = {
    name: "accent-foreground-large-focus",
    resolver: x => accentForegroundLarge(x).focus,
};

export const neutralfillrest: DesignSystemResolverEntry = {
    name: "neutral-fill-rest",
    resolver: x => neutralFill(x).rest,
};

export const neutralfillhover: DesignSystemResolverEntry = {
    name: "neutral-fill-hover",
    resolver: x => neutralFill(x).hover,
};

export const neutralfillactive: DesignSystemResolverEntry = {
    name: "neutral-fill-active",
    resolver: x => neutralFill(x).active,
};

export const neutralfillfocus: DesignSystemResolverEntry = {
    name: "neutral-fill-focus",
    resolver: x => neutralFill(x).focus,
};

export const neutralfillselected: DesignSystemResolverEntry = {
    name: "neutral-fill-selected",
    resolver: x => neutralFill(x).selected,
};

export const neutralfillstealthrest: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-rest",
    resolver: x => neutralFillStealth(x).rest,
};

export const neutralfillstealthhover: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-hover",
    resolver: x => neutralFillStealth(x).hover,
};

export const neutralfillstealthactive: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-active",
    resolver: x => neutralFillStealth(x).active,
};

export const neutralfillstealthfocus: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-focus",
    resolver: x => neutralFillStealth(x).focus,
};

export const neutralfillstealthselected: DesignSystemResolverEntry = {
    name: "neutral-fill-stealth-selected",
    resolver: x => neutralFillStealth(x).selected,
};

export const neutralfilltogglerest: DesignSystemResolverEntry = {
    name: "neutral-fill-toggle-rest",
    resolver: x => neutralFillToggle(x).rest,
};

export const neutralfilltogglehover: DesignSystemResolverEntry = {
    name: "neutral-fill-toggle-hover",
    resolver: x => neutralFillToggle(x).hover,
};

export const neutralfilltoggleactive: DesignSystemResolverEntry = {
    name: "neutral-fill-toggle-active",
    resolver: x => neutralFillToggle(x).active,
};

export const neutralfilltogglefocus: DesignSystemResolverEntry = {
    name: "neutral-fill-toggle-focus",
    resolver: x => neutralFillToggle(x).focus,
};

export const neutralfillinputrest: DesignSystemResolverEntry = {
    name: "neutral-fill-input-rest",
    resolver: x => neutralFillInput(x).rest,
};

export const neutralfillinputhover: DesignSystemResolverEntry = {
    name: "neutral-fill-input-hover",
    resolver: x => neutralFillInput(x).hover,
};

export const neutralfillinputactive: DesignSystemResolverEntry = {
    name: "neutral-fill-input-active",
    resolver: x => neutralFillInput(x).active,
};

export const neutralfillinputfocus: DesignSystemResolverEntry = {
    name: "neutral-fill-input-focus",
    resolver: x => neutralFillInput(x).focus,
};

export const accentfillrest: DesignSystemResolverEntry = {
    name: "accent-fill-rest",
    resolver: x => accentFill(x).rest,
};

export const accentfillhover: DesignSystemResolverEntry = {
    name: "accent-fill-hover",
    resolver: x => accentFill(x).hover,
};

export const accentfillactive: DesignSystemResolverEntry = {
    name: "accent-fill-active",
    resolver: x => accentFill(x).active,
};

export const accentfillfocus: DesignSystemResolverEntry = {
    name: "accent-fill-focus",
    resolver: x => accentFill(x).focus,
};

export const accentfillselected: DesignSystemResolverEntry = {
    name: "accent-fill-selected",
    resolver: x => accentFill(x).selected,
};

export const accentfilllargerest: DesignSystemResolverEntry = {
    name: "accent-fill-large-rest",
    resolver: x => accentFillLarge(x).rest,
};

export const accentfilllargehover: DesignSystemResolverEntry = {
    name: "accent-fill-large-hover",
    resolver: x => accentFillLarge(x).hover,
};

export const accentfilllargeactive: DesignSystemResolverEntry = {
    name: "accent-fill-large-active",
    resolver: x => accentFillLarge(x).active,
};

export const accentfilllargefocus: DesignSystemResolverEntry = {
    name: "accent-fill-large-focus",
    resolver: x => accentFillLarge(x).focus,
};

export const accentfilllargeselected: DesignSystemResolverEntry = {
    name: "accent-fill-large-selected",
    resolver: x => accentFillLarge(x).selected,
};

export const neutralfillcardrest: DesignSystemResolverEntry = {
    name: "neutral-fill-card-rest",
    resolver: x => neutralFillCard(x),
};

export const neutraloutlinerest: DesignSystemResolverEntry = {
    name: "neutral-outline-rest",
    resolver: x => neutralOutline(x).rest,
};

export const neutraloutlinehover: DesignSystemResolverEntry = {
    name: "neutral-outline-hover",
    resolver: x => neutralOutline(x).hover,
};

export const neutraloutlineactive: DesignSystemResolverEntry = {
    name: "neutral-outline-active",
    resolver: x => neutralOutline(x).active,
};

export const neutraloutlinefocus: DesignSystemResolverEntry = {
    name: "neutral-outline-focus",
    resolver: x => neutralOutline(x).focus,
};

export const neutraldividerrest: DesignSystemResolverEntry = {
    name: "neutral-divider-rest",
    resolver: x => neutralDividerRest(x),
};

export const neutrallayerfloating: DesignSystemResolverEntry = {
    name: "neutral-layer-floating",
    resolver: x => neutralLayerFloating(x),
};

export const neutrallayercard: DesignSystemResolverEntry = {
    name: "neutral-layer-card",
    resolver: x => neutralLayerCard(x),
};

export const neutrallayercardcontainer: DesignSystemResolverEntry = {
    name: "neutral-layer-card-container",
    resolver: x => neutralLayerCardContainer(x),
};

export const neutrallayerl1: DesignSystemResolverEntry = {
    name: "neutral-layer-l1",
    resolver: x => neutralLayerL1(x),
};

export const neutrallayerl1alt: DesignSystemResolverEntry = {
    name: "neutral-layer-l1-alt",
    resolver: x => neutralLayerL1Alt(x),
};

export const neutrallayerl2: DesignSystemResolverEntry = {
    name: "neutral-layer-l2",
    resolver: x => neutralLayerL2(x),
};

export const neutrallayerl3: DesignSystemResolverEntry = {
    name: "neutral-layer-l3",
    resolver: x => neutralLayerL3(x),
};

export const neutrallayerl4: DesignSystemResolverEntry = {
    name: "neutral-layer-l4",
    resolver: x => neutralLayerL4(x),
};

export const neutralfocus: DesignSystemResolverEntry = {
    name: "neutral-focus",
    resolver: x => neutralFocus(x),
};

export const neutralfocusinneraccent: DesignSystemResolverEntry = {
    name: "neutral-focus-inner-accent",
    resolver: x => neutralFocusInnerAccent(() => x.accentBaseColor)(x),
};
