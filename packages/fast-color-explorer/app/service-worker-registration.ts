if ("serviceWorker" in navigator) {
    window.addEventListener(
        "load",
        (): void => {
            navigator.serviceWorker.register("/service-worker.js");
        }
    );
}
