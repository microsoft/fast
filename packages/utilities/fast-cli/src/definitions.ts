import { createEnv } from "yeoman-environment";

export function definitions(options: any = {}): void {
    const env = createEnv();

    env.register(require.resolve("./generators/definitions"), "fast:definitions");

    env.run("fast:definitions", options);
}
