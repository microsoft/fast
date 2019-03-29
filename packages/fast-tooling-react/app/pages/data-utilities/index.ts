import { Plugin, PluginProps } from "../../../src";

export interface ExampleData {
    schema: any;
    data: any;
    component: React.ComponentClass;
    plugins?: Array<Plugin<PluginProps>>;
}

import TextComponent from "../../../src/__tests__/components/textarea";
import TextareaSchema from "../../../src/__tests__/schemas/textarea.schema.json";

export const textField: ExampleData = {
    schema: TextareaSchema,
    data: {
        text: "Hello world",
    },
    component: TextComponent,
};

import ChildrenComponent from "../../../src/__tests__/components/children";
import ChildrenSchema from "../../../src/__tests__/schemas/children.schema.json";

export const children: ExampleData = {
    schema: ChildrenSchema,
    data: {
        children: {
            id: TextareaSchema.id,
            props: {
                text: "Hello pluto",
            },
        },
    },
    component: ChildrenComponent,
};

import PluginComponent from "../../../src/__tests__/components/plugin";
import PluginSchema from "../../../src/__tests__/schemas/plugin.schema.json";
import DataPlugin from "../../../src/data-utilities/__tests__/plugins/map-children-prop-to-callback-passing-class-name";

export const plugin: ExampleData = {
    schema: PluginSchema,
    data: {
        renderProp: {
            id: TextareaSchema.id,
            props: {
                text: "Hello moon",
            },
        },
    },
    component: PluginComponent,
    plugins: [
        new DataPlugin({
            id: "plugin/renderProp",
        }),
    ],
};

export const pluginChildrenNesting: ExampleData = {
    schema: PluginSchema,
    data: {
        renderProp: {
            id: ChildrenSchema.id,
            props: {
                children: {
                    id: PluginSchema.id,
                    props: {
                        renderProp: {
                            id: TextareaSchema.id,
                            props: {
                                text: "Nested hello moon",
                            },
                        },
                    },
                },
            },
        },
    },
    component: PluginComponent,
    plugins: [
        new DataPlugin({
            id: "plugin/renderProp",
        }),
    ],
};

export const childrenPluginNesting: ExampleData = {
    schema: ChildrenSchema,
    data: {
        children: {
            id: PluginSchema.id,
            props: {
                renderProp: {
                    id: ChildrenSchema.id,
                    props: {
                        children: {
                            id: TextareaSchema.id,
                            props: {
                                text: "Nested hello pluto",
                            },
                        },
                    },
                },
            },
        },
    },
    component: ChildrenComponent,
    plugins: [
        new DataPlugin({
            id: "plugin/renderProp",
        }),
    ],
};
