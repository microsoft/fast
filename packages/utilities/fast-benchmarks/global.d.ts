declare global {
    function runFunction(): void;
    interface Window {
        runFunction: () => void;
    }
}

export {};
