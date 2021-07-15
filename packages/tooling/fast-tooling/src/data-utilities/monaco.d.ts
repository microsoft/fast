/**
 * These utilities are meant to facilitate the use of
 * the monaco editor https://github.com/Microsoft/monaco-editor
 * with FAST tooling
 */
import { DataDictionary, SchemaDictionary } from "../message-system";
export declare function mapDataDictionaryToMonacoEditorHTML(
    dataDictionary: DataDictionary<unknown>,
    schemaDictionary: SchemaDictionary
): string;
