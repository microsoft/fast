/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * All schemas and stores for caching component calls
 */
export const schemas = {
    presence: {
        name: "presence",
        stores: {
            presence: "presence",
        },
        version: 1,
    },
    users: {
        name: "users",
        stores: {
            users: "users",
            usersQuery: "usersQuery",
        },
        version: 1,
    },
    photos: {
        name: "photos",
        stores: {
            contacts: "contacts",
            users: "users",
        },
        version: 1,
    },
    people: {
        name: "people",
        stores: {
            contacts: "contacts",
            groupPeople: "groupPeople",
            peopleQuery: "peopleQuery",
        },
        version: 1,
    },
    groups: {
        name: "groups",
        stores: {
            groupsQuery: "groupsQuery",
        },
        version: 1,
    },
    get: {
        name: "responses",
        stores: {
            responses: "responses",
        },
        version: 1,
    },
};
