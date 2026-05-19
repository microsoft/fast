const dataThemeAttribute = "data-theme";
const darkThemeQuery = "(prefers-color-scheme: dark)";

function resolveTarget(target?: HTMLElement): HTMLElement | undefined {
    if (target) {
        return target;
    }

    if (typeof document === "undefined") {
        return undefined;
    }

    return document.documentElement;
}

/** The theme modes supported by the example design system. */
export type Theme = "light" | "dark" | "auto";

/**
 * Applies a theme to the provided target element.
 *
 * Passing `"auto"` removes the explicit theme override so the browser's
 * `prefers-color-scheme` setting controls the active token values.
 *
 * @param theme - The theme to apply.
 * @param target - The element that stores the `data-theme` attribute.
 */
export function applyTheme(theme: Theme, target?: HTMLElement): void {
    const resolvedTarget = resolveTarget(target);

    if (!resolvedTarget) {
        return;
    }

    if (theme === "auto") {
        resolvedTarget.removeAttribute(dataThemeAttribute);
        return;
    }

    resolvedTarget.setAttribute(dataThemeAttribute, theme);
}

/**
 * Gets the current theme from the provided target element.
 *
 * @param target - The element that stores the `data-theme` attribute.
 * @returns The current theme, or `"auto"` when no explicit theme is set.
 */
export function getTheme(target?: HTMLElement): Theme {
    const resolvedTarget = resolveTarget(target);
    const theme = resolvedTarget?.getAttribute(dataThemeAttribute);

    return theme === "light" || theme === "dark" ? theme : "auto";
}

/**
 * Returns whether the current environment prefers a dark color scheme.
 *
 * The function is safe to call during SSR and returns `false` when `window`
 * is not available.
 *
 * @returns `true` when the environment prefers dark mode.
 */
export function prefersDarkTheme(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }

    return window.matchMedia(darkThemeQuery).matches;
}

/**
 * Toggles between light and dark themes on the provided target element.
 *
 * When the current theme is `"auto"`, the function resolves the active theme
 * from `prefers-color-scheme` before toggling.
 *
 * @param target - The element that stores the `data-theme` attribute.
 * @returns The new explicit theme after toggling.
 */
export function toggleTheme(target?: HTMLElement): Theme {
    const currentTheme = getTheme(target);
    const resolvedTheme =
        currentTheme === "auto" ? (prefersDarkTheme() ? "dark" : "light") : currentTheme;
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme, target);

    return nextTheme;
}

/**
 * Subscribes to theme changes on the provided target element.
 *
 * @param listener - The callback invoked when the theme attribute changes.
 * @param target - The element that stores the `data-theme` attribute.
 * @returns A disposer that stops observing theme changes.
 */
export function onThemeChange(
    listener: (theme: Theme) => void,
    target?: HTMLElement,
): () => void {
    const resolvedTarget = resolveTarget(target);

    if (!resolvedTarget || typeof MutationObserver === "undefined") {
        return () => {};
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === dataThemeAttribute
            ) {
                listener(getTheme(resolvedTarget));
                break;
            }
        }
    });

    observer.observe(resolvedTarget, {
        attributes: true,
        attributeFilter: [dataThemeAttribute],
    });

    return () => {
        observer.disconnect();
    };
}
