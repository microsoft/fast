import type { FullConfig } from "@playwright/test";

export default async function globalSetup(_config: FullConfig): Promise<void> {
    // No global setup needed on v3 (SSR webui-todo-app example is not present).
}
