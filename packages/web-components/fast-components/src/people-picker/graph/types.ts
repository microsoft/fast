/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

/**
 * IDynamicPerson describes the person object we use throughout mgt-person,
 * which can be one of three similar Graph types.
 *
 * In addition, this custom type also defines the optional `personImage` property,
 * which is used to pass the image around to other components as part of the person object.
 */
export type IDynamicPerson = (
    | MicrosoftGraph.User
    | MicrosoftGraph.Person
    | MicrosoftGraph.Contact
) & {
    /**
     * personDetails.personImage is a toolkit injected property to pass image between components
     * an optimization to avoid fetching the image when unnecessary.
     *
     * @type {string}
     */
    personImage?: string;
};

/**
 *  avatarSize describes the enum strings that can be passed in to determine
 *  size of avatar. And in turn will determine presence badge added to it.
 */
export type AvatarSize = "small" | "large" | "auto";
