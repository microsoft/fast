/* tslint:disable:max-classes-per-file */
import "jest";
import { mapPluginsToSchema } from "./form-plugin.utilities";
import { FormPlugin, FormPluginProps } from "../";
import * as pluginSchema from "../../app/configs/plugin/plugin.schema.json";
import { cloneDeep, set, unset } from "lodash-es";

describe("mapPluginsToSchema", () => {
    test("should map a single datatype to another datatype", () => {
        class MyUpdateSchemaPlugin extends FormPlugin<FormPluginProps> {
            public resolver(schema: any): any {
                return Object.assign({}, schema, { type: "number" });
            }
        }

        const updatedSchema: any = cloneDeep(pluginSchema);
        set(updatedSchema, "properties.pluginModifiedString.type", "number");
        set(
            updatedSchema,
            "properties.oneOfs.oneOf.0.properties.pluginModifiedString.type",
            "number"
        );

        expect(
            mapPluginsToSchema(pluginSchema, {}, [
                new MyUpdateSchemaPlugin({ id: "plugins/pluginModifiedString" }),
            ])
        ).toEqual(updatedSchema);
    });
    test("should map a multiple datatype to another datatype", () => {
        class MyUpdateMultipleSchemaPlugin extends FormPlugin<FormPluginProps> {
            public resolver(schema: any): any {
                return Object.assign({}, schema, { type: "number" });
            }
        }

        const updatedSchema: any = cloneDeep(pluginSchema);
        set(updatedSchema, "properties.pluginModifiedString.type", "number");
        set(
            updatedSchema,
            "properties.oneOfs.oneOf.0.properties.pluginModifiedString.type",
            "number"
        );
        set(updatedSchema, "properties.pluginModifiedBoolean.type", "number");

        expect(
            mapPluginsToSchema(pluginSchema, {}, [
                new MyUpdateMultipleSchemaPlugin({
                    id: ["plugins/pluginModifiedString", "plugins/pluginModifiedBoolean"],
                }),
            ])
        ).toEqual(updatedSchema);
    });
    test("should remove a section of the JSON schema", () => {
        class MyRemoveSectionSchemaPlugin extends FormPlugin<FormPluginProps> {
            public resolver(schema: any): any {
                return undefined;
            }
        }

        const updatedSchema: any = cloneDeep(pluginSchema);
        unset(updatedSchema, "properties.pluginModifiedString");
        unset(updatedSchema, "properties.oneOfs.oneOf.0.properties.pluginModifiedString");

        expect(
            mapPluginsToSchema(pluginSchema, {}, [
                new MyRemoveSectionSchemaPlugin({
                    id: "plugins/pluginModifiedString",
                }),
            ])
        ).toEqual(updatedSchema);
    });
    test("should change the returned partial schema conditionally if specified in the provided plugin", () => {
        class MyUpdateSchemaPlugin extends FormPlugin<FormPluginProps> {
            public resolver(schema: any, data: any): any {
                if (data.pluginModifiedString === 5) {
                    return undefined;
                }

                return Object.assign({}, schema, { type: "number" });
            }
        }

        const plugins: Array<FormPlugin<FormPluginProps>> = [
            new MyUpdateSchemaPlugin({
                id: "plugins/pluginModifiedString",
            }),
        ];

        const beforeDataUpdateSchema: any = cloneDeep(pluginSchema);
        set(beforeDataUpdateSchema, "properties.pluginModifiedString.type", "number");
        set(
            beforeDataUpdateSchema,
            "properties.oneOfs.oneOf.0.properties.pluginModifiedString.type",
            "number"
        );

        const mappedSchema: any = mapPluginsToSchema(pluginSchema, {}, plugins);

        expect(mappedSchema).toEqual(beforeDataUpdateSchema);

        const afterDataUpdateSchema: any = cloneDeep(mappedSchema);
        unset(afterDataUpdateSchema, "properties.pluginModifiedString");
        unset(
            afterDataUpdateSchema,
            "properties.oneOfs.oneOf.0.properties.pluginModifiedString"
        );

        const updatedMappedSchema: any = mapPluginsToSchema(
            mappedSchema,
            {
                pluginModifiedString: 5,
            },
            plugins
        );

        expect(updatedMappedSchema).toEqual(afterDataUpdateSchema);
    });
});
