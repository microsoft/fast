import { Plugin, PluginProps } from "@microsoft/fast-data-utilities-react";

export default class TextPlugin extends Plugin<PluginProps> {
    public resolver(data: string): string {
        return `${data} - modified by plugin`;
    }
}
