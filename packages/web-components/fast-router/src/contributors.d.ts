import { HTMLDirective } from "@microsoft/fast-element";
import {
    NavigationCommitPhaseHook,
    NavigationPhaseHook,
    NavigationPhaseName,
} from "./phases";
/**
 * @alpha
 */
export declare type NavigationContributor<TSettings = any> = Partial<
    Record<Exclude<NavigationPhaseName, "commit">, NavigationPhaseHook<TSettings>>
> & {
    commit?: NavigationCommitPhaseHook<TSettings>;
};
/**
 * @alpha
 */
export declare function isNavigationPhaseContributor<T extends NavigationPhaseName>(
    object: any,
    phase: T
): object is Record<T, NavigationPhaseHook>;
/**
 * @alpha
 */
export declare type ContributorOptions = {
    lifecycle?: boolean;
    parameters?: boolean;
};
/**
 * @alpha
 */
export declare function navigationContributor(
    options?: ContributorOptions
): HTMLDirective;
