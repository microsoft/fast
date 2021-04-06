/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ErrorListenerCallback {
    (error: any): void;
}

export interface ErrorListenerUnbind {
    (): void;
}

// Avoid circular dependency on EventEmitter by implementing a subset of the interface.
export class ErrorHandler {
    private unexpectedErrorHandler: (e: any) => void;
    private listeners: ErrorListenerCallback[];

    constructor() {
        this.listeners = [];

        this.unexpectedErrorHandler = function (e: any) {
            setTimeout(() => {
                if (e.stack) {
                    throw new Error(e.message + "\n\n" + e.stack);
                }

                throw e;
            }, 0);
        };
    }

    public addListener(listener: ErrorListenerCallback): ErrorListenerUnbind {
        this.listeners.push(listener);

        return () => {
            this._removeListener(listener);
        };
    }

    private emit(e: any): void {
        this.listeners.forEach(listener => {
            listener(e);
        });
    }

    private _removeListener(listener: ErrorListenerCallback): void {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }

    public onUnexpectedError(e: any): void {
        this.unexpectedErrorHandler(e);
        this.emit(e);
    }
}

export const errorHandler = new ErrorHandler();

export function onUnexpectedError(e: any): undefined {
    // ignore errors from cancelled promises
    if (!isPromiseCanceledError(e)) {
        errorHandler.onUnexpectedError(e);
    }
    return undefined;
}

const canceledName = "Canceled";

/**
 * Checks if the given error is a promise in canceled state
 */
export function isPromiseCanceledError(error: any): boolean {
    return (
        error instanceof Error &&
        error.name === canceledName &&
        error.message === canceledName
    );
}
