import { NavigationCommand } from "./commands";
import { NavigationMessage } from "./navigation";
import { NavigationPhase } from "./phases";
import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";

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
