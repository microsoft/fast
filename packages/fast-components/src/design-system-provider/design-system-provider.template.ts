import {
    accentFill,
    accentFillLarge,
    accentForeground,
    accentForegroundCut,
    accentForegroundLarge,
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
import { html } from "@microsoft/fast-element";
import { DesignSystemProvider } from "./design-system-provider";

export const DesignSystemProviderTemplate = html<DesignSystemProvider>`
  <template style="
    --accent-base-color: ${x => x.accentBaseColor};
    --background-color: ${x => x.backgroundColor};
    --base-height-multiplier: ${x => x.baseHeightMultiplier};
    --body-font: ${x => x.bodyFont};
    --corner-radius: ${x => x.cornerRadius};
    --disabled-opacity: ${x => x.disabledOpacity};
    --density: ${x => x.density};
    --design-unit: ${x => x.designUnit};
    --elevated-corner-radius: ${x => x.elevatedCornerRadius};
    --focus-outline-width: ${x => x.focusOutlineWidth};
    --outline-width: ${x => x.outlineWidth};

    --height-number: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit));

    --neutral-foreground-rest: ${x => neutralForeground(x.designSystem).rest};
    --neutral-foreground-hover: ${x => neutralForeground(x.designSystem).hover};
    --neutral-foreground-active: ${x => neutralForeground(x.designSystem).active};
    --neutral-foreground-focus: ${x => neutralForeground(x.designSystem).focus};

    --neutral-foreground-toggle: ${x => neutralForegroundToggle(x.designSystem)};
    --neutral-foreground-toggle-large: ${x =>
        neutralForegroundToggleLarge(x.designSystem)};

    --neutral-foreground-hint: ${x => neutralForegroundHint(x.designSystem)};
    --neutral-foreground-hint-large: ${x => neutralForegroundHintLarge(x.designSystem)};

    --accent-foreground-rest: ${x => accentForeground(x.designSystem).rest};
    --accent-foreground-hover: ${x => accentForeground(x.designSystem).hover};
    --accent-foreground-active: ${x => accentForeground(x.designSystem).active};
    --accent-foreground-focus: ${x => accentForeground(x.designSystem).focus};

    --accent-foreground-cut-rest: ${x => accentForegroundCut(x.designSystem)};

    --accent-foreground-large-rest: ${x => accentForegroundLarge(x.designSystem).rest};
    --accent-foreground-large-hover: ${x => accentForegroundLarge(x.designSystem).hover};
    --accent-foreground-large-active: ${x =>
        accentForegroundLarge(x.designSystem).active};
    --accent-foreground-large-focus: ${x => accentForegroundLarge(x.designSystem).focus};

    --neutral-fill-rest: ${x => neutralFill(x.designSystem).rest};
    --neutral-fill-hover: ${x => neutralFill(x.designSystem).hover};
    --neutral-fill-active: ${x => neutralFill(x.designSystem).active};
    --neutral-fill-focus: ${x => neutralFill(x.designSystem).focus};
    --neutral-fill-selected: ${x => neutralFill(x.designSystem).selected};

    --neutral-fill-stealth-rest: ${x => neutralFillStealth(x.designSystem).rest};
    --neutral-fill-stealth-hover: ${x => neutralFillStealth(x.designSystem).hover};
    --neutral-fill-stealth-active: ${x => neutralFillStealth(x.designSystem).active};
    --neutral-fill-stealth-focus: ${x => neutralFillStealth(x.designSystem).focus};
    --neutral-fill-stealth-selected: ${x => neutralFillStealth(x.designSystem).selected};

    --neutral-fill-toggle-rest: ${x => neutralFillToggle(x.designSystem).rest};
    --neutral-fill-toggle-hover: ${x => neutralFillToggle(x.designSystem).hover};
    --neutral-fill-toggle-active: ${x => neutralFillToggle(x.designSystem).active};
    --neutral-fill-toggle-focus: ${x => neutralFillToggle(x.designSystem).focus};

    --neutral-fill-input-rest: ${x => neutralFillInput(x.designSystem).rest};
    --neutral-fill-input-hover: ${x => neutralFillInput(x.designSystem).hover};
    --neutral-fill-input-active: ${x => neutralFillInput(x.designSystem).active};
    --neutral-fill-input-focus: ${x => neutralFillInput(x.designSystem).focus};

    --accent-fill-rest: ${x => accentFill(x.designSystem).rest};
    --accent-fill-hover: ${x => accentFill(x.designSystem).hover};
    --accent-fill-active: ${x => accentFill(x.designSystem).active};
    --accent-fill-focus: ${x => accentFill(x.designSystem).focus};
    --accent-fill-selected: ${x => accentFill(x.designSystem).selected};

    --accent-fill-large-rest: ${x => accentFillLarge(x.designSystem).rest};
    --accent-fill-large-hover: ${x => accentFillLarge(x.designSystem).hover};
    --accent-fill-large-active: ${x => accentFillLarge(x.designSystem).active};
    --accent-fill-large-focus: ${x => accentFillLarge(x.designSystem).focus};
    --accent-fill-large-selected: ${x => accentFillLarge(x.designSystem).selected};

    --neutral-fill-card-rest: ${x => neutralFillCard(x.designSystem)};

    --neutral-outline-rest: ${x => neutralOutline(x.designSystem).rest};
    --neutral-outline-hover: ${x => neutralOutline(x.designSystem).hover};
    --neutral-outline-active: ${x => neutralOutline(x.designSystem).active};
    --neutral-outline-focus: ${x => neutralOutline(x.designSystem).focus};

    --neutral-divider-rest: ${x => neutralDividerRest(x.designSystem)};

    --neutral-layer-floating: ${x => neutralLayerFloating(x.designSystem)};
    --neutral-layer-card: ${x => neutralLayerCard(x.designSystem)};
    --neutral-layer-card-container: ${x => neutralLayerCardContainer(x.designSystem)};
    --neutral-layer-l1: ${x => neutralLayerL1(x.designSystem)};
    --neutral-layer-l1-alt: ${x => neutralLayerL1Alt(x.designSystem)};
    --neutral-layer-l2: ${x => neutralLayerL2(x.designSystem)};
    --neutral-layer-l3: ${x => neutralLayerL3(x.designSystem)};
    --neutral-layer-l4: ${x => neutralLayerL4(x.designSystem)};

    --neutral-focus: ${x => neutralFocus(x.designSystem)};

    --neutral-focus-inner-accent: ${x =>
        neutralFocusInnerAccent(() => x.designSystem.accentBaseColor)(x.designSystem)};
  ">
  <slot></slot>
  </template>
`;
