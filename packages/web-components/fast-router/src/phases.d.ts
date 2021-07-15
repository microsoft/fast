import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";
/**
 * @alpha
 */
export declare type NavigationPhaseName =
    | "navigate"
    | "leave"
    | "construct"
    | "enter"
    | "commit";
/**
 * @alpha
 */
export declare type NavigationPhaseHook<TSettings = any> = (
    phase: NavigationPhase<TSettings>
) => Promise<any> | any;
/**
 * @alpha
 */
export declare type NavigationCommitPhaseHook<TSettings = any> = (
    phase: NavigationCommitPhase<TSettings>
) => Promise<any> | any;
/**
 * @alpha
 */
export declare type NavigationPhaseFollowupAction = () => Promise<any> | any;
/**
 * @alpha
 */
export interface NavigationPhase<TSettings = any> {
    readonly name: NavigationPhaseName;
    readonly route: RecognizedRoute<TSettings>;
    readonly router: Router<TSettings>;
    readonly canceled: boolean;
    cancel(callback?: NavigationPhaseFollowupAction): void;
    onCancel(callback: NavigationPhaseFollowupAction): void;
    onCommit(callback: NavigationPhaseFollowupAction): void;
    evaluateContributor(
        contributor: any,
        route?: RecognizedRoute<TSettings>,
        router?: Router<TSettings>
    ): Promise<void>;
}
/**
 * @alpha
 */
export interface NavigationCommitPhase<TSettings = any>
    extends Omit<NavigationPhase<TSettings>, "cancel" | "canceled" | "onCancel"> {
    setTitle(title: string): any;
}
