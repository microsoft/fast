import { NavigationCommand } from "./commands.js";
import { NavigationMessage } from "./navigation.js";
import { NavigationPhase } from "./phases.js";
import { RecognizedRoute } from "./recognizer.js";
import { Router } from "./router.js";

/**
 * @alpha
 */
export interface RoutingEventSink {
    onUnhandledNavigationMessage(router: Router, message: NavigationMessage): void;
    onNavigationBegin(
        router: Router,
        route: RecognizedRoute,
        command: NavigationCommand
    ): void;
    onPhaseBegin(phase: NavigationPhase): void;
    onPhaseEnd(phase: NavigationPhase): void;
    onNavigationEnd(
        router: Router,
        route: RecognizedRoute,
        command: NavigationCommand
    ): void;
}

/**
 * @alpha
 */
export class DefaultRoutingEventSink implements RoutingEventSink {
    onUnhandledNavigationMessage(router: Router, message: NavigationMessage): void {}
    onNavigationBegin(
        router: Router,
        route: RecognizedRoute,
        command: NavigationCommand
    ): void {}
    onPhaseBegin(phase: NavigationPhase): void {}
    onPhaseEnd(phase: NavigationPhase): void {}
    onNavigationEnd(
        router: Router,
        route: RecognizedRoute,
        command: NavigationCommand
    ): void {}
}
