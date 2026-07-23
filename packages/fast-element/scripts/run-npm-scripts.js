import { spawn } from "node:child_process";
import { constants } from "node:os";

const scripts = process.argv.slice(2);
const npmExecPath = process.env.npm_execpath;
const isWindows = process.platform === "win32";

if (scripts.length < 2) {
    throw new Error("Specify at least two npm scripts to run in parallel.");
}

if (!npmExecPath) {
    throw new Error("Run this script from an npm script.");
}

const children = new Map();
let shuttingDown = false;
let resolveCompletion;

const completion = new Promise(resolve => {
    resolveCompletion = resolve;
});

function signalExitCode(signal) {
    return signal ? 128 + (constants.signals[signal] ?? 0) : 1;
}

function reportTerminationError(script, error) {
    console.error(`Failed to stop npm script "${script}":`, error);
    process.exitCode = 1;
}

function terminateProcessTree(child, script, signal) {
    if (child.pid === undefined) {
        return;
    }

    if (isWindows) {
        const taskkill = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
            stdio: "ignore",
            windowsHide: true,
        });

        taskkill.once("error", error => {
            reportTerminationError(script, error);
            child.kill();
        });
        return;
    }

    try {
        // Detached children lead their process groups, so this stops their descendants too.
        process.kill(-child.pid, signal);
    } catch (error) {
        if (error.code !== "ESRCH") {
            reportTerminationError(script, error);
        }
        return;
    }

    const forceKillTimer = setTimeout(() => {
        if (!children.has(child)) {
            return;
        }

        try {
            process.kill(-child.pid, "SIGKILL");
        } catch (error) {
            if (error.code !== "ESRCH") {
                reportTerminationError(script, error);
            }
        }
    }, 2500);

    forceKillTimer.unref();
    children.get(child).forceKillTimer = forceKillTimer;
}

function beginShutdown(exitCode, signal = "SIGTERM") {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;
    process.exitCode = exitCode;

    for (const [child, { script }] of children) {
        terminateProcessTree(child, script, signal);
    }

    if (children.size === 0) {
        resolveCompletion();
    }
}

function handleChildExit(child, code, signal) {
    const childState = children.get(child);

    if (!childState) {
        return;
    }

    children.delete(child);
    clearTimeout(childState.forceKillTimer);

    if (!shuttingDown) {
        beginShutdown(code ?? signalExitCode(signal));
    }

    if (children.size === 0) {
        resolveCompletion();
    }
}

for (const script of scripts) {
    const child = spawn(process.execPath, [npmExecPath, "run", script], {
        cwd: process.cwd(),
        detached: !isWindows,
        env: process.env,
        stdio: "inherit",
    });

    children.set(child, { script, forceKillTimer: undefined });
    child.once("error", error => {
        console.error(`Failed to start npm script "${script}":`, error);
        handleChildExit(child, 1);
    });
    child.once("exit", (code, signal) => handleChildExit(child, code, signal));
}

process.once("SIGINT", () => beginShutdown(signalExitCode("SIGINT"), "SIGINT"));
process.once("SIGTERM", () => beginShutdown(signalExitCode("SIGTERM")));

await completion;
