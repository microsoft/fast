import type { HostController } from "../styles/host.js";

/**
 * Guards asynchronous work against disconnecting or reconnecting a component.
 * @public
 */
export class ConnectionGuard {
    private _generation: object | null = null;
    private readonly _controller: HostController;

    /**
     * Creates a guard whose lifetime follows the controller's host behaviors.
     * @param controller - The controller whose connection to guard.
     */
    public constructor(controller: HostController) {
        this._controller = controller;
        controller.addBehavior({
            connectedCallback: () => {
                this._generation = {};
            },
            disconnectedCallback: () => {
                this._generation = null;
            },
        });
    }

    /**
     * Captures the current connection and returns a predicate that checks it.
     * A capture made while disconnected never becomes current. Register the guard
     * before preparation behaviors to capture during pre-bind preparation; that
     * capture becomes current once the controller connects.
     * Disconnecting permanently invalidates captures from that connection.
     * This does not cancel work or release resources.
     */
    public capture(): () => boolean {
        const generation = this._generation;

        return () =>
            generation !== null &&
            generation === this._generation &&
            this._controller.isConnected;
    }
}
