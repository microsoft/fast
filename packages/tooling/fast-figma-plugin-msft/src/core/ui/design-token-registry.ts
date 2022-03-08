import { DesignToken } from "@microsoft/fast-foundation";

export enum DesignTokenType {
    designToken = "designToken",
    layerFill = "layerFill",
    backgroundFill = "backgroundFill",
    foregroundFill = "foregroundFill",
    strokeFill = "strokeFill",
    strokeWidth = "strokeWidth",
    cornerRadius = "cornerRadius",
    fontName = "fontName",
    fontSize = "fontSize",
    lineHeight = "lineHeight",
}

export enum FormControlId {
    text = "text",
    color = "color",
}

/**
 * An interface where all keys of DesignTokenTypes map to a type
 */
export type MappedDesignTokenTypes<T> = { [K in keyof typeof DesignTokenType]: T };

/**
 * Defines a generic design token
 */
/* eslint-disable-next-line @typescript-eslint/ban-types */
export interface DesignTokenDefinition<T extends {} = any> {
    /**
     * A title for organizing recipe sets
     */
    groupTitle: string;

    /**
     * The name of the design token
     */
    name: string;

    /**
     * Unique ID for the design token
     */
    id: string;

    /**
     * The type of design token
     */
    type: DesignTokenType;

    /**
     * The type of form control to edit this value. Following convention from fast-tooling.
     */
    formControlId?: string;

    /**
     * The underlying DesignToken for the plugin definition
     */
    token: DesignToken<T>;
}

export class DesignTokenRegistry {
    private entries: { [id: string]: DesignTokenDefinition } = {};

    /**
     * Register a new design token
     * @param designToken the design token to register
     */
    public register(designToken: DesignTokenDefinition): void {
        const { id } = designToken;

        if (this.isRegistered(id)) {
            throw new Error(
                `Design token of id ${id} has already been registered. You must unregister the registered design token before registering with that ID.`
            );
        } else {
            this.entries[id] = designToken;
        }
    }

    /**
     * Unregister a design token
     * @param id - the ID of the design token to unregister
     */
    public unregister(id: string): void {
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        /* @ts-ignore-next-line no-implicit-any */
        delete this.register[id];
    }

    /**
     * Get a design token definition by ID
     * @param id the id of the design token
     */
    public get<T>(id: string): DesignTokenDefinition<T> | null {
        if (this.isRegistered(id)) {
            return this.entries[id];
        }

        return null;
        // throw new Error(`Design token of id ${id} does not exist`);
    }

    /**
     * Determines if the design token has been registered
     * @param id - the id of the design token
     */
    public isRegistered(id: string): boolean {
        return this.entries.hasOwnProperty(id);
    }

    /**
     * Returns all entries of a given design token type
     * @param type the design token type to return entries of
     */
    public find(type: DesignTokenType): DesignTokenDefinition[] {
        return Object.values(this.entries).filter(value => value.type === type);
    }
}
